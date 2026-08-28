"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ label }: { label: string }) {
  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");

    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      <Moon className="theme-icon-moon" aria-hidden="true" />
      <Sun className="theme-icon-sun" aria-hidden="true" />
    </button>
  );
}
