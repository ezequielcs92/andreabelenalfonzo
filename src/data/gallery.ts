import { getCloudflareImage } from "./site";

export const galleryItems = Array.from({ length: 64 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return {
    id: number,
    src: getCloudflareImage(`andrea-media-${number}`),
  };
});
