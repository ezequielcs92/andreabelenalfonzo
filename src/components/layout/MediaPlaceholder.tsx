import { ImageIcon } from "lucide-react";

export function MediaPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`media-placeholder ${className}`}>
      <ImageIcon aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
