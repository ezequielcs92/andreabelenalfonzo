"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { galleryItems } from "@/data/gallery";

function getTileVariant(index: number) {
  const position = index % 10;
  if (position === 0) return "media-tile-feature";
  if (position === 1 || position === 2) return "media-tile-tall";
  if (position === 3) return "media-tile-wide";
  return "media-tile-square";
}

function getAdjacentItemId(current: string | null, direction: -1 | 1) {
  const currentIndex = galleryItems.findIndex((item) => item.id === current);
  if (currentIndex < 0) return null;
  return galleryItems[(currentIndex + direction + galleryItems.length) % galleryItems.length].id;
}

export function Gallery() {
  const t = useTranslations("gallery");
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedItem = galleryItems.find((item) => item.id === selected);
  const selectedIndex = galleryItems.findIndex((item) => item.id === selected);
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen) return;

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
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") setSelected((current) => getAdjacentItemId(current, -1));
      if (event.key === "ArrowRight") setSelected((current) => getAdjacentItemId(current, 1));
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
  }, [isOpen]);

  return (
    <section id="photos" className="section gallery-section">
      <div className="section-shell">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <p className="gallery-lead">{t("lead")}</p>
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              className={`gallery-item ${getTileVariant(index)}`}
              type="button"
              aria-label={`${t("open")}: ${t("imageAlt", { number: Number(item.id) })}`}
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
                  alt={t("imageAlt", { number: Number(item.id) })}
                  fill
                  quality={90}
                  sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                />
              </motion.div>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={t("imageAlt", { number: Number(selectedItem.id) })}
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
                alt={t("imageAlt", { number: Number(selectedItem.id) })}
                fill
                quality={90}
                sizes="90vw"
              />
            </motion.div>
            <button
              className="carousel-control carousel-control-previous"
              type="button"
              aria-label={t("previous")}
              onClick={() => setSelected((current) => getAdjacentItemId(current, -1))}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              className="carousel-control carousel-control-next"
              type="button"
              aria-label={t("next")}
              onClick={() => setSelected((current) => getAdjacentItemId(current, 1))}
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <p className="carousel-counter" aria-live="polite">
              {t("position", { current: selectedIndex + 1, total: galleryItems.length })}
            </p>
            <button
              className="modal-close"
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
