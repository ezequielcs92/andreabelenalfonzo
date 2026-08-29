import { getCloudflareImage } from "./site";

export const galleryItems = [
  { id: "01", src: getCloudflareImage("andrea-photo-054"), className: "gallery-tall" },
  { id: "02", src: getCloudflareImage("andrea-photo-020"), className: "gallery-wide" },
  { id: "03", src: getCloudflareImage("andrea-photo-010"), className: "gallery-square" },
  { id: "04", src: getCloudflareImage("andrea-photo-024"), className: "gallery-tall" },
  { id: "05", src: getCloudflareImage("andrea-photo-037"), className: "gallery-square" },
  { id: "06", src: getCloudflareImage("andrea-photo-057"), className: "gallery-wide" },
  { id: "07", src: getCloudflareImage("andrea-photo-058"), className: "gallery-square" },
  { id: "08", src: getCloudflareImage("andrea-photo-034"), className: "gallery-tall" },
  { id: "09", src: getCloudflareImage("andrea-photo-021"), className: "gallery-square" },
] as const;

export const galleryIds = galleryItems.map((item) => item.id);
