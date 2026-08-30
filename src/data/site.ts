const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  configuredSiteUrl || "https://andreabelenalfonzo.com";

const CLOUDFLARE_IMAGES_URL =
  "https://imagedelivery.net/pnqdzV2zvEe_nleOYtoUKQ";

const CLOUDFLARE_STREAM_URL =
  "https://customer-mjd8o63x3qakbzze.cloudflarestream.com";

export function getCloudflareImage(id: string) {
  return `${CLOUDFLARE_IMAGES_URL}/${id}/public`;
}

export function getStreamThumbnail(uid: string) {
  return `${CLOUDFLARE_STREAM_URL}/${uid}/thumbnails/thumbnail.jpg?width=720&height=900&fit=crop`;
}

export function getStreamIframe(uid: string) {
  return `${CLOUDFLARE_STREAM_URL}/${uid}/iframe?autoplay=true`;
}

export const media = {
  hero: getCloudflareImage("andrea-media-067"),
  portrait: getCloudflareImage("55a59cda-ac64-4b24-e934-794931066300"),
} as const;

export const contact = {
  email: "andreabelenalfonzo1@gmail.com",
  instagram: "https://instagram.com/andreabelenalfonzoo",
  whatsapp: "5491122449236",
} as const;

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
