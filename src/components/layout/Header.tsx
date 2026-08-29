"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggle } from "./ThemeToggle";

const navItems = ["about", "disciplines", "experience", "training", "photos", "videos", "fullActs", "specs", "contact"] as const;

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setVisible(latest > window.innerHeight * 0.65 && (latest < previous || latest < window.innerHeight));
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      className="site-header"
      initial={false}
      animate={{ y: visible || menuOpen ? 0 : -110 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="header-mark" href="#top" aria-label={t("footer.backToTop")}>AA</a>
      <nav className="desktop-nav" aria-label={t("common.menuOpen")}>
        {navItems.map((item) => (
          <a key={item} href={`#${item}`}>{t(`nav.${item}`)}</a>
        ))}
      </nav>
      <div className="header-actions">
        <Link href={`${pathname}${hash}`} locale="es" className={locale === "es" ? "active" : ""}>ES</Link>
        <span aria-hidden="true">/</span>
        <Link href={`${pathname}${hash}`} locale="en" className={locale === "en" ? "active" : ""}>EN</Link>
        <ThemeToggle label={t("common.themeToggle")} />
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t("common.menuClose") : t("common.menuOpen")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={reduce ? false : { clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={reduce ? undefined : { clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={t("common.menuOpen")}>
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                  initial={reduce ? false : { x: 24 }}
                  animate={{ x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>{t(`nav.${item}`)}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
