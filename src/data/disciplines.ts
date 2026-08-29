import { getCloudflareImage } from "./site";

export const disciplines = [
  { id: "hairHanging", media: getCloudflareImage("andrea-media-056") },
  { id: "aerialLyra", media: getCloudflareImage("andrea-media-055") },
  { id: "aerialDrop", media: getCloudflareImage("andrea-media-021") },
  { id: "aerialSilks", media: getCloudflareImage("andrea-media-005") },
] as const;
