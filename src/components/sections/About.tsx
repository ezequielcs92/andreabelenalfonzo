import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { media } from "@/data/site";

export async function About() {
  const t = await getTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="section-shell about-grid">
        <Parallax className="about-portrait">
          <Image
            src={media.portrait}
            alt={t("portraitAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            className="media-image"
          />
        </Parallax>
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
