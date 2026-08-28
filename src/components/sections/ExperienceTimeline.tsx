"use client";

import { MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";

type Production = { title: string; bullets: string[] };
export type ExperienceItem = { company: string; place: string; period: string; role: string; summary: string; bullets: string[]; featured?: boolean; badge?: string; productions?: Production[] };

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 70%"] });
  return (
    <div ref={ref} className="timeline">
      <motion.div className="timeline-line" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
      {items.map((item, index) => (
        <motion.article key={item.company} className={`timeline-item${item.featured ? " timeline-featured" : ""}`} initial={reduce ? false : { x: 20 }} whileInView={{ x: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.7 }}>
          <div className="timeline-dot" aria-hidden="true" />
          <p className="timeline-number">{String(index + 1).padStart(2, "0")}</p>
          {item.badge && <p className="timeline-badge">{item.badge}</p>}
          <p className="timeline-period">{item.period}</p>
          <h3>{item.company}</h3>
          <p className="timeline-place"><MapPin aria-hidden="true" />{item.place}</p>
          <p className="timeline-role">{item.role}</p>
          <p className="timeline-summary">{item.summary}</p>
          {item.bullets.length > 0 && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          {item.productions?.map((production) => <div className="production" key={production.title}><h4>{production.title}</h4><ul>{production.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>)}
        </motion.article>
      ))}
    </div>
  );
}
