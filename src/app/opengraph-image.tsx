import { ImageResponse } from "next/og";

export const alt = "Andrea Alfonzo — Aerialista y bailarina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px", background: "linear-gradient(135deg,#6E0D3E,#9C1458 60%,#2B1A22)", color: "white", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 22, textTransform: "uppercase", letterSpacing: 8, color: "#E8D9A0" }}>Artista circense · Buenos Aires</div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1 }}>ANDREA<br />ALFONZO</div><div style={{ display: "flex", marginTop: 28, fontSize: 30, fontWeight: 300 }}>Aerialista y bailarina</div></div></div>, size);
}
