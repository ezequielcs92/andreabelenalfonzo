"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { media } from "@/data/site";

export function Hero() {
  const t = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0.18]);
  const words = t("hero.name").split(" ");

  return (
    <section ref={ref} id="top" className="hero" aria-labelledby="hero-title">
      <motion.div className="hero-media" style={{ y: backgroundY }}>
        <Image
          src={media.hero}
          alt=""
          fill
          quality={90}
          preload
          sizes="(max-width: 600px) 210vh, 100vw"
          className="hero-image"
        />
      </motion.div>
      <div className="hero-overlay" />
      <motion.div className="hero-content" style={{ y: contentY, opacity: contentOpacity }}>
        <p className="hero-location">{t("hero.location")}</p>
        <h1 id="hero-title">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={reduce ? false : { y: 36 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >{word}{index < words.length - 1 ? "\u00a0" : ""}</motion.span>
          ))}
        </h1>
        <p className="hero-tagline">{t("hero.tagline")}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">{t("hero.ctaPrimary")} <ArrowUpRight /></a>
          <a className="button button-ghost" href="#photos">{t("hero.ctaSecondary")}</a>
        </div>
      </motion.div>
      <a className="scroll-cue" href="#about"><span>{t("common.scroll")}</span><ArrowDown /></a>
    </section>
  );
}
