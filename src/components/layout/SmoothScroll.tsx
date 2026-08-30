"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const onModalChange = (event: Event) => {
      const { open } = (event as CustomEvent<{ open: boolean }>).detail;
      if (open) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("modal-change", onModalChange);
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("modal-change", onModalChange);
      lenis.destroy();
    };
  }, [reduce]);

  return children;
}
