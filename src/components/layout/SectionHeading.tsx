export function SectionHeading({ eyebrow, title, invert = false }: { eyebrow: string; title: string; invert?: boolean }) {
  return (
    <div className={`section-heading${invert ? " section-heading-invert" : ""}`}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span aria-hidden="true" />
    </div>
  );
}
