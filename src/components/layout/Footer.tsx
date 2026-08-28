import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="site-footer">
      <p>{t("rights")}</p>
      <a href="#top">{t("backToTop")} <ArrowUpRight aria-hidden="true" /></a>
    </footer>
  );
}
