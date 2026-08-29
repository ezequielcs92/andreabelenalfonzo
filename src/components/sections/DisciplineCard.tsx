"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function DisciplineCard({ name, description, media, index }: { name: string; description: string; media: string; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article className="discipline-card" initial={reduce ? false : { y: 24 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ delay: index * 0.08 }}>
      <motion.div className="discipline-media" whileHover={reduce ? undefined : { scale: 1.04 }} transition={{ duration: 0.8 }}>
        <Image src={media} alt={name} fill sizes="(max-width: 600px) 100vw, 50vw" />
      </motion.div>
      <svg aria-hidden="true" className="card-outline"><motion.rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" fill="none" initial={reduce ? { pathLength: 1 } : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: index * 0.08 }} /></svg>
      <div className="discipline-copy"><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p></div>
    </motion.article>
  );
}
