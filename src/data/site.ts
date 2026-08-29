const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  configuredSiteUrl || "https://andreabelenalfonzo.com";

const CLOUDFLARE_IMAGES_URL =
  "https://imagedelivery.net/pnqdzV2zvEe_nleOYtoUKQ";

export const media = {
  portrait: `${CLOUDFLARE_IMAGES_URL}/55a59cda-ac64-4b24-e934-794931066300/public`,
} as const;

export const contact = {
  email: "andreabelenalfonzo1@gmail.com",
  instagram: "https://instagram.com/andreabelenalfonzoo",
  whatsapp: "5491122449236",
} as const;

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
