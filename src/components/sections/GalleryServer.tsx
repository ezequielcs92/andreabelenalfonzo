import { Gallery } from "./Gallery";
import {
  buildPublicGalleryItems,
  getPublicGalleryState,
} from "@/lib/gallery-state";

export async function GalleryServer() {
  const state = await getPublicGalleryState();
  const items = buildPublicGalleryItems(state);
  return <Gallery items={items} />;
}
