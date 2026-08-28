import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { contact, getWhatsAppUrl } from "@/data/site";
import { SectionHeading } from "@/components/layout/SectionHeading";

export async function Contact() {
  const t = await getTranslations("contact");
  const links = [
    { label: t("whatsapp"), href: getWhatsAppUrl(t("whatsappMessage")), icon: MessageCircle, rel: "noopener noreferrer" },
    { label: t("email"), href: `mailto:${contact.email}`, icon: Mail, rel: "noopener noreferrer" },
    { label: t("instagram"), href: contact.instagram, icon: Instagram, rel: "me noopener noreferrer" },
  ];
  return <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="section-shell"><SectionHeading eyebrow={t("eyebrow")} title={t("title")} invert /><p id="contact-title" className="contact-lead">{t("lead")}</p><div className="contact-links">{links.map(({ label, href, icon: Icon, rel }) => <a key={label} href={href} target="_blank" rel={rel}><Icon aria-hidden="true" /><span>{label}</span><ArrowUpRight aria-hidden="true" /></a>)}</div></div></section>;
}
