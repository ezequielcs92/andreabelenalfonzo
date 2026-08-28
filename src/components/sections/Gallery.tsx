"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { galleryItems } from "@/data/gallery";
import { SectionHeading } from "@/components/layout/SectionHeading";

export function Gallery() {
  const t = useTranslations("gallery");
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); triggerRef.current?.focus(); };
  }, [selected]);

  return <section id="gallery" className="section gallery-section" aria-labelledby="gallery-title"><div className="section-shell"><SectionHeading eyebrow={t("eyebrow")} title={t("title")} /><p className="gallery-lead">{t("lead")}</p><div id="gallery-title" className="gallery-grid">{galleryItems.map((item) => <button key={item.id} className={`gallery-item ${item.className}`} type="button" aria-label={`${t("open")}: ${t(`items.${item.id}`)}`} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(item.id); }}><motion.div layoutId={reduce ? undefined : `gallery-${item.id}`} className="gallery-placeholder"><span>{t(`items.${item.id}`)}</span></motion.div></button>)}</div><div className="reel-placeholder"><div><span>{t("reel")}</span><strong>{t("reelMedia")}</strong></div></div></div><AnimatePresence>{selected && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={t("items." + selected)} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div layoutId={reduce ? undefined : `gallery-${selected}`} className="lightbox-image"><span>{t(`items.${selected}`)}</span></motion.div><button ref={closeRef} type="button" aria-label={t("close")} onClick={() => setSelected(null)}><X /></button></motion.div>}</AnimatePresence></section>;
}
