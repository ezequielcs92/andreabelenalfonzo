import { getCloudflareImage } from "./site";

export const disciplines = [
  { id: "hairHanging", media: getCloudflareImage("andrea-media-066") },
  { id: "aerialLyra", media: getCloudflareImage("andrea-media-055") },
  { id: "aerialDrop", media: getCloudflareImage("andrea-media-065") },
  { id: "aerialSilks", media: getCloudflareImage("andrea-media-005") },
] as const;
