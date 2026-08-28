import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { disciplines } from "@/data/disciplines";
import { DisciplineCard } from "./DisciplineCard";

export async function Disciplines() {
  const t = await getTranslations("disciplines");
  return (
    <section id="disciplines" className="section disciplines-section" aria-labelledby="disciplines-title">
      <div className="section-shell">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="disciplines-grid" id="disciplines-title">
          {disciplines.map((item, index) => <DisciplineCard key={item.id} index={index} media={item.media} name={t(`${item.id}.name`)} description={t(`${item.id}.description`)} />)}
        </div>
        <Reveal className="disciplines-other"><span aria-hidden="true" /><p>{t("other")}</p></Reveal>
      </div>
    </section>
  );
}
