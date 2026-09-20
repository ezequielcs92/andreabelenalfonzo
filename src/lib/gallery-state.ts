import { unstable_cache } from "next/cache";
import {
  ALL_GALLERY_IDS,
  getGalleryImageSrc,
  type GalleryItem,
} from "@/data/gallery";
import { AdminAuthError } from "./admin-auth";

export type GalleryState = {
  order: string[];
  hidden: string[];
  updatedAt?: string;
};

const ALL_GALLERY_ID_SET = new Set(ALL_GALLERY_IDS);

function getD1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN?.trim();

  if (!accountId || !databaseId || !apiToken) {
    return null;
  }

  return { accountId, databaseId, apiToken };
}

type D1QueryResponse = {
  success: boolean;
  errors?: { code: number; message: string }[];
  messages?: { code: number; message: string }[];
  result?: {
    results: Record<string, unknown>[];
    success: boolean;
  }[];
};

async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[],
): Promise<T[]> {
  const config = getD1Config();
  if (!config) {
    throw new AdminAuthError("D1 is not configured", 503);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });

  let data: D1QueryResponse;
  try {
    data = (await response.json()) as D1QueryResponse;
  } catch {
    throw new AdminAuthError("Invalid response from D1", 502);
  }

  if (!response.ok || !data.success) {
    const message = data.errors?.[0]?.message ?? "D1 query failed";
    throw new AdminAuthError(message, response.ok ? 502 : response.status);
  }

  return (data.result?.[0]?.results ?? []) as T[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateGalleryState(body: unknown): asserts body is GalleryState {
  if (!body || typeof body !== "object") {
    throw new AdminAuthError("Invalid body", 400);
  }

  const { order, hidden } = body as Record<string, unknown>;

  if (!isStringArray(order) || order.length !== ALL_GALLERY_IDS.length) {
    throw new AdminAuthError(
      `Order must contain exactly ${ALL_GALLERY_IDS.length} IDs`,
      400,
    );
  }

  const orderSet = new Set(order);
  if (orderSet.size !== order.length) {
    throw new AdminAuthError("Order contains duplicate IDs", 400);
  }

  for (const id of order) {
    if (!ALL_GALLERY_ID_SET.has(id)) {
      throw new AdminAuthError("Invalid gallery state", 400);
    }
  }

  if (!isStringArray(hidden)) {
    throw new AdminAuthError("Hidden must be an array of IDs", 400);
  }

  const hiddenSet = new Set(hidden);
  if (hiddenSet.size !== hidden.length) {
    throw new AdminAuthError("Hidden contains duplicate IDs", 400);
  }

  for (const id of hidden) {
    if (!ALL_GALLERY_ID_SET.has(id)) {
      throw new AdminAuthError("Invalid gallery state", 400);
    }
  }

  if (hiddenSet.size >= ALL_GALLERY_IDS.length) {
    throw new AdminAuthError("At least one image must remain visible", 400);
  }
}

function normalizeState(row: { state: string }): GalleryState {
  try {
    const parsed = JSON.parse(row.state) as unknown;
    validateGalleryState(parsed);
    return parsed;
  } catch {
    return { order: ALL_GALLERY_IDS, hidden: [] };
  }
}

export async function getAdminGalleryState(): Promise<GalleryState> {
  const rows = await d1Query<{ state: string }>(
    "SELECT state FROM gallery_state WHERE id = 1",
    [],
  );

  if (rows.length === 0) {
    return { order: ALL_GALLERY_IDS, hidden: [] };
  }

  return normalizeState(rows[0]);
}

export async function updateAdminGalleryState(state: GalleryState) {
  validateGalleryState(state);

  await d1Query(
    "INSERT OR REPLACE INTO gallery_state (id, state, updated_at) VALUES (1, ?, datetime('now'))",
    [JSON.stringify(state)],
  );
}

const getCachedPublicState = unstable_cache(
  async (): Promise<GalleryState> => {
    try {
      return await getAdminGalleryState();
    } catch {
      return { order: ALL_GALLERY_IDS, hidden: [] };
    }
  },
  ["gallery-public-state"],
  { tags: ["gallery"], revalidate: 300 },
);

export async function getPublicGalleryState(): Promise<GalleryState> {
  return getCachedPublicState();
}

export function buildPublicGalleryItems(state: GalleryState): GalleryItem[] {
  const hiddenSet = new Set(state.hidden);
  const visibleIds =
    state.order.length === ALL_GALLERY_IDS.length
      ? state.order.filter((id) => !hiddenSet.has(id))
      : ALL_GALLERY_IDS.filter((id) => !hiddenSet.has(id));

  return visibleIds.map((id) => ({ id, src: getGalleryImageSrc(id) }));
}
