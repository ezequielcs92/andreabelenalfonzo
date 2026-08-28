import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export async function Training() {
  const t = await getTranslations("training");
  const education = t.raw("education") as string[];
  const workshops = t.raw("workshops") as string[];
  return <section id="training" className="section training-section" aria-labelledby="training-title"><div className="section-shell"><SectionHeading eyebrow={t("eyebrow")} title={t("title")} /><div id="training-title" className="training-grid"><Reveal><h3>{t("educationTitle")}</h3><ul className="education-list">{education.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></Reveal><Reveal delay={0.1}><h3>{t("workshopsTitle")}</h3><div className="workshop-list">{workshops.map((item, index) => <span key={item} style={{ "--index": index } as React.CSSProperties}>{item}</span>)}</div></Reveal></div></div></section>;
}
