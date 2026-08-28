export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://andreabelenalfonzo.com";

export const contact = {
  email: "andreabelenalfonzo1@gmail.com",
  instagram: "https://instagram.com/andreabelenalfonzoo",
  whatsapp: "5491122449236",
} as const;

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
