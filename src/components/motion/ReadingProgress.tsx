"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";

export function ReadingProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduce) return null;

  return <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />;
}
