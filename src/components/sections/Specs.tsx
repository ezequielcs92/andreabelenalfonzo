import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

type Spec = { label: string; value: string };
export async function Specs() {
  const t = await getTranslations("specs");
  const items = t.raw("items") as Spec[];
  return <section id="specs" className="section specs-section" aria-labelledby="specs-title"><div className="section-shell"><SectionHeading eyebrow={t("eyebrow")} title={t("title")} /><dl id="specs-title" className="specs-grid">{items.map((item, index) => <Reveal key={item.label} delay={(index % 4) * 0.04}><div><dt>{item.label}</dt><dd>{item.value}</dd></div></Reveal>)}</dl></div></section>;
}
