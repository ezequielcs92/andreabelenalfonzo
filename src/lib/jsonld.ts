import type { AppLocale } from "@/i18n/routing";
import { SITE_URL, contact } from "@/data/site";

export function getJsonLd(locale: AppLocale, description: string) {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/${locale}#andrea`,
    name: "Andrea Belén Alfonzo",
    alternateName: "Andrea Alfonzo",
    jobTitle: locale === "es" ? "Aerialista y bailarina" : "Aerialist and dancer",
    description,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/media/og.jpg`,
    nationality: "Argentina",
    address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
    knowsLanguage: ["es", "en"],
    knowsAbout: ["Hair hanging", "Aerial lyra", "Aerial silks", "Aerial drop straps", "Dance"],
    sameAs: [contact.instagram],
  };
  return {
    "@context": "https://schema.org",
    "@graph": [person, { "@type": "ProfilePage", "@id": `${SITE_URL}/${locale}#profile`, url: `${SITE_URL}/${locale}`, mainEntity: { "@id": person["@id"] } }],
  };
}
