export const galleryItems = [
  { id: "01", className: "gallery-tall" },
  { id: "02", className: "gallery-wide" },
  { id: "03", className: "gallery-square" },
  { id: "04", className: "gallery-tall" },
  { id: "05", className: "gallery-square" },
  { id: "06", className: "gallery-wide" },
  { id: "07", className: "gallery-square" },
  { id: "08", className: "gallery-tall" },
  { id: "09", className: "gallery-square" },
] as const;

export const galleryIds = galleryItems.map((item) => item.id);
