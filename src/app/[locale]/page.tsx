import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Disciplines } from "@/components/sections/Disciplines";
import { Experience } from "@/components/sections/Experience";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Specs } from "@/components/sections/Specs";
import { Training } from "@/components/sections/Training";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <><Hero /><About /><Disciplines /><Experience /><Training /><Gallery /><Specs /><Contact /></>;
}
