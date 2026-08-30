"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getStreamIframe, getStreamThumbnail } from "@/data/site";
import { videos } from "@/data/videos";

function getTileVariant(index: number) {
  const position = index % 10;
  if (position === 0) return "media-tile-feature";
  if (position === 1 || position === 2) return "media-tile-tall";
  if (position === 3) return "media-tile-wide";
  return "media-tile-square";
}

function getAdjacentVideoId(current: string | null, direction: -1 | 1) {
  const currentIndex = videos.findIndex((video) => video.id === current);
  if (currentIndex < 0) return null;
  return videos[(currentIndex + direction + videos.length) % videos.length].id;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export function Videos() {
  const t = useTranslations("videos");
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedVideo = videos.find((video) => video.id === selectedId);
  const selectedIndex = videos.findIndex((video) => video.id === selectedId);
  const isOpen = selectedId !== null;

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
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowLeft") setSelectedId((current) => getAdjacentVideoId(current, -1));
      if (event.key === "ArrowRight") setSelectedId((current) => getAdjacentVideoId(current, 1));
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
    <section id="videos" className="section videos-section">
      <div className="section-shell">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <p className="videos-lead">{t("lead")}</p>
        <div className="videos-grid">
          {videos.map((video, index) => (
            <motion.button
              key={video.id}
              type="button"
              className={`video-card ${getTileVariant(index)}`}
              aria-label={`${t("play")}: ${t("item", { number: Number(video.id) })}`}
              initial={reduce ? false : { y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.06 }}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedId(video.id);
              }}
            >
              <Image
                src={getStreamThumbnail(video.uid)}
                alt=""
                fill
                quality={90}
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
              />
              <span className="video-card-overlay" />
              <span className="video-card-play"><Play aria-hidden="true" /></span>
              <span className="video-card-copy">
                <strong>{t("item", { number: Number(video.id) })}</strong>
                <small>{formatDuration(video.duration)}</small>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("item", { number: Number(selectedVideo.id) })}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
          >
            <div className="stream-player" key={selectedVideo.uid}>
              <iframe
                src={getStreamIframe(selectedVideo.uid)}
                title={t("item", { number: Number(selectedVideo.id) })}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              className="carousel-control carousel-control-previous"
              type="button"
              aria-label={t("previous")}
              onClick={() => setSelectedId((current) => getAdjacentVideoId(current, -1))}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              className="carousel-control carousel-control-next"
              type="button"
              aria-label={t("next")}
              onClick={() => setSelectedId((current) => getAdjacentVideoId(current, 1))}
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <p className="carousel-counter" aria-live="polite">
              {t("position", { current: selectedIndex + 1, total: videos.length })}
            </p>
            <button className="modal-close" ref={closeRef} type="button" aria-label={t("close")} onClick={() => setSelectedId(null)}>
              <X aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
