import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { SITE_URL } from "@/data/site";
import { routing, type AppLocale } from "@/i18n/routing";
import { getJsonLd } from "@/lib/jsonld";
import "../globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600", "800"], display: "swap", variable: "--font-poppins" });

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = `${SITE_URL}/${locale}`;
  return {
    metadataBase: new URL(SITE_URL), title: t("title"), description: t("description"), keywords: t("keywords").split(", "),
    alternates: { canonical, languages: { es: `${SITE_URL}/es`, en: `${SITE_URL}/en`, "x-default": `${SITE_URL}/es` } },
    openGraph: { type: "profile", title: t("title"), description: t("description"), url: canonical, siteName: "Andrea Alfonzo", locale: locale === "es" ? "es_AR" : "en_US", alternateLocale: locale === "es" ? ["en_US"] : ["es_AR"], images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: [`${SITE_URL}/opengraph-image`] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "meta" });
  const jsonLd = getJsonLd(locale as AppLocale, t("description"));
  return <html lang={locale} className={poppins.variable}><body><NextIntlClientProvider messages={messages}><a className="skip-link" href="#main">{messages.common && (messages.common as Record<string, string>).skip}</a><SmoothScroll><ReadingProgress /><Header /><main id="main">{children}</main><Footer /></SmoothScroll></NextIntlClientProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></body></html>;
}
