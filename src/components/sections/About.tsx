import { getTranslations } from "next-intl/server";
import { MediaPlaceholder } from "@/components/layout/MediaPlaceholder";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";

export async function About() {
  const t = await getTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="section-shell about-grid">
        <Parallax className="about-portrait"><MediaPlaceholder label={t("portrait")} /></Parallax>
        <div className="about-copy">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          <div id="about-title" className="about-text">
            {paragraphs.map((paragraph, index) => <Reveal key={paragraph} delay={index * 0.05}><p>{paragraph}</p></Reveal>)}
          </div>
        </div>
      </div>
    </section>
  );
}
