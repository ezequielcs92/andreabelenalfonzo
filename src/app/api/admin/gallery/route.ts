import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  AdminAuthError,
  getAdminOrigin,
  verifyAdminAccess,
} from "@/lib/admin-auth";
import {
  getAdminGalleryState,
  updateAdminGalleryState,
  validateGalleryState,
} from "@/lib/gallery-state";

function errorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    if (error.status >= 500) {
      console.error("Admin gallery service error:", error);
    }
    return NextResponse.json(
      { error: error.status < 500 ? error.message : "Service unavailable" },
      { status: error.status, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  console.error("Admin gallery API error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500, headers: { "Cache-Control": "private, no-store" } },
  );
}

function assertSafeOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const canonicalOrigin = getAdminOrigin();
  const fetchSite = request.headers.get("sec-fetch-site");

  if (process.env.NODE_ENV === "development") {
    if (
      origin &&
      !origin.startsWith("http://localhost") &&
      !origin.startsWith("http://127.0.0.1") &&
      origin !== canonicalOrigin
    ) {
      throw new AdminAuthError("Invalid origin", 403);
    }
  } else {
    if (origin !== canonicalOrigin) {
      throw new AdminAuthError("Invalid origin", 403);
    }
  }

  if (fetchSite && fetchSite !== "same-origin") {
    throw new AdminAuthError("Invalid fetch site", 403);
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdminAccess(request.headers);
    const state = await getAdminGalleryState();
    return NextResponse.json(state, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await verifyAdminAccess(request.headers);
    assertSafeOrigin(request);

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(contentLength) || contentLength > 50_000) {
      throw new AdminAuthError("Payload too large", 413);
    }

    const rawBody = await request.text();
    if (rawBody.length > 50_000) {
      throw new AdminAuthError("Payload too large", 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      throw new AdminAuthError("Invalid JSON body", 400);
    }

    validateGalleryState(body);
    await updateAdminGalleryState(body);

    revalidateTag("gallery", { expire: 0 });
    revalidatePath("/es");
    revalidatePath("/en");

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
