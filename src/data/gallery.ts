import { getCloudflareImage } from "./site";

export const ALL_GALLERY_IDS = Array.from({ length: 64 }, (_, index) =>
  String(index + 1).padStart(3, "0"),
);

export function getGalleryImageSrc(id: string) {
  return getCloudflareImage(`andrea-media-${id}`);
}

export const FALLBACK_GALLERY_ITEMS = ALL_GALLERY_IDS.map((id) => ({
  id,
  src: getGalleryImageSrc(id),
}));

export type GalleryItem = {
  id: string;
  src: string;
};
