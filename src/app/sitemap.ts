import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: `${SITE_URL}/es`, en: `${SITE_URL}/en` };
  return ["es", "en"].map((locale) => ({ url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: locale === "es" ? 1 : 0.9, alternates: { languages } }));
}
