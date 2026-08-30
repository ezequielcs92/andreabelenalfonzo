"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { fullActs } from "@/data/fullActs";

export function FullActs() {
  const t = useTranslations("fullActs");
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedAct = fullActs.find((act) => act.id === selectedId);

  useEffect(() => {
    if (!selectedId) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const preventScroll = (event: Event) => event.preventDefault();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.dispatchEvent(new CustomEvent("modal-change", { detail: { open: true } }));
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.dispatchEvent(new CustomEvent("modal-change", { detail: { open: false } }));
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedId]);

  return (
    <section
      id="fullActs"
      className="section full-acts-section"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          invert
        />
        <p className="full-acts-lead">{t("lead")}</p>
        <div className="full-acts-grid">
          {fullActs.map((act, index) => (
              <motion.button
                key={act.id}
                type="button"
                className="full-act-card"
                aria-label={`${t("play")}: ${t(`items.${act.id}.title`)}`}
                initial={reduce ? false : { y: 24 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setSelectedId(act.id);
                }}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${act.youtubeId}/hqdefault.jpg`}
                  alt=""
                  fill
                  quality={90}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <span className="full-act-overlay" />
                <span className="full-act-play"><Play aria-hidden="true" /></span>
                <span className="full-act-copy">
                  <small>{t("play")}</small>
                  <strong>{t(`items.${act.id}.title`)}</strong>
                </span>
              </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedAct && (
          <motion.div
            className="youtube-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t(`items.${selectedAct.id}.title`)}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
          >
            <div className="youtube-player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedAct.youtubeId}?autoplay=1&rel=0`}
                title={t(`items.${selectedAct.id}.title`)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label={t("close")}
              onClick={() => setSelectedId(null)}
            >
              <X aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
