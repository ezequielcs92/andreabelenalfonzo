import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import esMessages from "../../../messages/es.json";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: esMessages.admin.title,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
