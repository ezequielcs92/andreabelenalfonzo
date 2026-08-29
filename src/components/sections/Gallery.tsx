"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { galleryItems } from "@/data/gallery";

export function Gallery() {
  const t = useTranslations("gallery");
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedItem = galleryItems.find((item) => item.id === selected);

  useEffect(() => {
    if (!selected) return;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selected]);

  return (
    <section id="gallery" className="section gallery-section">
      <div className="section-shell">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <p className="gallery-lead">{t("lead")}</p>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <button
              key={item.id}
              className={`gallery-item ${item.className}`}
              type="button"
              aria-label={`${t("open")}: ${t(`items.${item.id}`)}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelected(item.id);
              }}
            >
              <motion.div
                layoutId={reduce ? undefined : `gallery-${item.id}`}
                className="gallery-media"
              >
                <Image
                  src={item.src}
                  alt={t(`items.${item.id}`)}
                  fill
                  sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                />
              </motion.div>
            </button>
          ))}
        </div>
        <div className="reel-placeholder">
          <div><span>{t("reel")}</span><strong>{t("reelMedia")}</strong></div>
        </div>
      </div>
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={t(`items.${selectedItem.id}`)}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
          >
            <motion.div
              layoutId={reduce ? undefined : `gallery-${selectedItem.id}`}
              className="lightbox-image"
            >
              <Image
                src={selectedItem.src}
                alt={t(`items.${selectedItem.id}`)}
                fill
                sizes="90vw"
              />
            </motion.div>
            <button
              ref={closeRef}
              type="button"
              aria-label={t("close")}
              onClick={() => setSelected(null)}
            >
              <X aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
