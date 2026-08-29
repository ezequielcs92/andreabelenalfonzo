"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getStreamIframe, getStreamThumbnail } from "@/data/site";
import { videos } from "@/data/videos";

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

  useEffect(() => {
    if (!selectedId) return;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedId]);

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
              className="video-card"
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
            <div className="stream-player">
              <iframe
                src={getStreamIframe(selectedVideo.uid)}
                title={t("item", { number: Number(selectedVideo.id) })}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button ref={closeRef} type="button" aria-label={t("close")} onClick={() => setSelectedId(null)}>
              <X aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
