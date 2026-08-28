import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { experiences } from "@/data/experience";
import { ExperienceTimeline, type ExperienceItem } from "./ExperienceTimeline";

export async function Experience() {
  const t = await getTranslations("experience");
  const items: ExperienceItem[] = experiences.map((entry) => {
    const productions = "productions" in entry ? entry.productions.map((id) => ({ title: t(`${entry.id}.productions.${id}.title`), bullets: t.raw(`${entry.id}.productions.${id}.bullets`) as string[] })) : undefined;
    return { company: t(`${entry.id}.company`), place: t(`${entry.id}.place`), period: t(`${entry.id}.period`), role: t(`${entry.id}.role`), summary: t(`${entry.id}.summary`), bullets: entry.bulletCount ? t.raw(`${entry.id}.bullets`) as string[] : [], featured: "featured" in entry && entry.featured, badge: "featured" in entry && entry.featured ? t("international") : undefined, productions };
  });
  return <section id="experience" className="section experience-section" aria-labelledby="experience-title"><div className="section-shell experience-shell"><SectionHeading eyebrow={t("eyebrow")} title={t("title")} /><div id="experience-title"><ExperienceTimeline items={items} /></div></div></section>;
}
