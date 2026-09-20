import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdminGalleryClient } from "@/components/admin/AdminGalleryClient";
import { ALL_GALLERY_IDS } from "@/data/gallery";
import { SITE_URL } from "@/data/site";
import { AdminAuthError, verifyAdminAccess } from "@/lib/admin-auth";
import {
  getAdminGalleryState,
  type GalleryState,
} from "@/lib/gallery-state";
import esMessages from "../../../messages/es.json";

export const dynamic = "force-dynamic";

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="admin-page">
      <main className="admin-main">
        <div className="admin-help" role="alert">
          {message}
        </div>
      </main>
    </div>
  );
}

export default async function AdminPage() {
  const headersList = await headers();

  let auth: { email: string };
  try {
    auth = await verifyAdminAccess(headersList);
  } catch (error) {
    const status = error instanceof AdminAuthError ? error.status : 500;
    if (status === 401 || status === 403) notFound();
    return (
      <ErrorPanel
        message={esMessages.admin.serviceUnavailable}
      />
    );
  }

  let state: GalleryState;
  let d1Unavailable = false;
  try {
    state = await getAdminGalleryState();
  } catch {
    state = { order: ALL_GALLERY_IDS, hidden: [] };
    d1Unavailable = true;
  }

  return (
    <AdminGalleryClient
      messages={esMessages.admin}
      initialOrder={state.order}
      initialHidden={state.hidden}
      userEmail={auth.email}
      d1Unavailable={d1Unavailable}
      publicGalleryUrl={`${SITE_URL}/es#photos`}
    />
  );
}
