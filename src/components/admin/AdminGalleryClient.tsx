"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  GripVertical,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ALL_GALLERY_IDS,
  getGalleryImageSrc,
} from "@/data/gallery";

type AdminMessages = {
  title: string;
  eyebrow: string;
  description: string;
  tabPublished: string;
  tabBin: string;
  save: string;
  saving: string;
  saved: string;
  saveError: string;
  loadError: string;
  serviceUnavailable: string;
  unauthorized: string;
  unsavedChanges: string;
  noChanges: string;
  dragHandle: string;
  moveBackward: string;
  moveForward: string;
  moveUp: string;
  moveDown: string;
  hide: string;
  restore: string;
  emptyBin: string;
  counterVisible: string;
  counterHidden: string;
  preview: string;
  openImage: string;
  closeModal: string;
  previous: string;
  next: string;
  modalTitle: string;
  modalNavigation: string;
  modalOrdering: string;
  modalPosition: string;
  statusVisible: string;
  statusHidden: string;
  imageAlt: string;
  help: string;
};

type AdminGalleryClientProps = {
  messages: AdminMessages;
  initialOrder: string[];
  initialHidden: string[];
  userEmail: string;
  d1Unavailable: boolean;
  publicGalleryUrl: string;
};

function formatTemplate(template: string, replacements: Record<string, string | number>) {
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}

function setsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

export function AdminGalleryClient({
  messages,
  initialOrder,
  initialHidden,
  userEmail,
  d1Unavailable,
  publicGalleryUrl,
}: AdminGalleryClientProps) {
  const initialVisible = useMemo(
    () => initialOrder.filter((id) => !initialHidden.includes(id)),
    [initialOrder, initialHidden],
  );

  const [activeTab, setActiveTab] = useState<"published" | "bin">("published");
  const [visibleOrder, setVisibleOrder] = useState<string[]>(initialVisible);
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [savedVisibleOrder, setSavedVisibleOrder] = useState<string[]>(initialVisible);
  const [savedHidden, setSavedHidden] = useState<Set<string>>(new Set(initialHidden));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [modalId, setModalId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const hasChanges = useMemo(
    () =>
      !arraysEqual(visibleOrder, savedVisibleOrder) ||
      !setsEqual(hidden, savedHidden),
    [visibleOrder, savedVisibleOrder, hidden, savedHidden],
  );

  const buildState = useCallback((): {
    order: string[];
    hidden: string[];
  } => {
    const hiddenArray = ALL_GALLERY_IDS.filter((id) => hidden.has(id));
    const visibleSet = new Set(visibleOrder);
    const missingVisible = ALL_GALLERY_IDS.filter(
      (id) => !hidden.has(id) && !visibleSet.has(id),
    );
    const order = [...visibleOrder, ...missingVisible, ...hiddenArray];
    return { order, hidden: hiddenArray };
  }, [hidden, visibleOrder]);

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timeout = setTimeout(() => setStatus("idle"), 4000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const moveVisible = useCallback((id: string, direction: -1 | 1) => {
    setVisibleOrder((current) => {
      const index = current.indexOf(id);
      if (index < 0) return current;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }, []);

  const hide = useCallback((id: string) => {
    if (visibleOrder.length <= 1) return;
    setVisibleOrder((current) => current.filter((item) => item !== id));
    setHidden((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setModalId((current) => (current === id ? null : current));
    setActiveTab((current) => (current === "published" ? "bin" : current));
  }, [visibleOrder.length]);

  const restore = useCallback((id: string) => {
    setHidden((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setVisibleOrder((current) => {
      if (current.includes(id)) return current;
      return [...current, id];
    });
    setModalId((current) => (current === id ? null : current));
    setActiveTab((current) => (current === "bin" ? "published" : current));
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
  }, []);

  const handleDragOver = useCallback(
    (draggedId: string, targetId: string | null) => {
      setDropTargetId(
        activeTab === "published" && targetId && draggedId !== targetId
          ? targetId
          : null,
      );
    },
    [activeTab],
  );

  const handleDrop = useCallback(
    (draggedId: string, targetId: string) => {
      if (!draggedId || draggedId === targetId || activeTab !== "published") {
        setDraggingId(null);
        setDropTargetId(null);
        return;
      }

      setVisibleOrder((current) => {
        const fromIndex = current.indexOf(draggedId);
        const toIndex = current.indexOf(targetId);
        if (fromIndex < 0 || toIndex < 0) return current;
        const next = [...current];
        next.splice(fromIndex, 1);
        next.splice(toIndex, 0, draggedId);
        return next;
      });

      setDraggingId(null);
      setDropTargetId(null);
    },
    [activeTab],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const body = buildState();
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSavedVisibleOrder([...visibleOrder]);
      setSavedHidden(new Set(hidden));
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }, [buildState, hidden, visibleOrder]);

  const openModal = useCallback((id: string, trigger: HTMLButtonElement | null) => {
    triggerRef.current = trigger;
    setModalId(id);
  }, []);

  const closeModal = useCallback(() => {
    setModalId(null);
  }, []);

  const navigateModal = useCallback((id: string) => {
    setModalId(id);
  }, []);

  if (d1Unavailable) {
    return (
      <div className="admin-page">
        <main className="admin-main">
          <div className="admin-help" role="alert">
            <AlertCircle aria-hidden="true" />
            {messages.serviceUnavailable}
          </div>
        </main>
      </div>
    );
  }

  const hiddenItems = ALL_GALLERY_IDS.filter((id) => hidden.has(id));
  const currentFilterIds = activeTab === "published" ? visibleOrder : hiddenItems;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p>{messages.eyebrow}</p>
          <h1>{messages.title}</h1>
        </div>
        <div className="admin-toolbar">
          <span className="admin-user">{userEmail}</span>
          <Link className="admin-button" href={publicGalleryUrl} target="_blank" rel="noopener noreferrer">
            {messages.preview}
          </Link>
          <button
            className="admin-button admin-button-primary"
            type="button"
            disabled={saving || !hasChanges}
            onClick={handleSave}
          >
            <Save aria-hidden="true" size={16} />
            {saving ? messages.saving : messages.save}
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-status-bar" aria-live="polite" aria-atomic="true">
          <span className={`admin-change-badge ${hasChanges ? "unsaved" : ""}`}>
            {hasChanges ? messages.unsavedChanges : messages.noChanges}
          </span>
          {status === "success" && (
            <span className="admin-status success" role="status">
              <Check aria-hidden="true" size={16} /> {messages.saved}
            </span>
          )}
          {status === "error" && (
            <span className="admin-status error" role="alert">
              <AlertCircle aria-hidden="true" size={16} /> {messages.saveError}
            </span>
          )}
        </div>

        <p className="admin-help">{messages.help}</p>

        <div
          className="admin-tabs"
          role="tablist"
          aria-label={messages.description}
          onKeyDown={(event) => {
            const tabs = ["published", "bin"] as const;
            let nextIndex = tabs.indexOf(activeTab);

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              nextIndex = (nextIndex + 1) % tabs.length;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              nextIndex = (nextIndex - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
              nextIndex = 0;
            } else if (event.key === "End") {
              nextIndex = tabs.length - 1;
            } else {
              return;
            }

            event.preventDefault();
            const nextTab = tabs[nextIndex];
            setActiveTab(nextTab);
            requestAnimationFrame(() => {
              document.getElementById(`${nextTab}-tab`)?.focus();
            });
          }}
        >
          <button
            className={`admin-tab ${activeTab === "published" ? "active" : ""}`}
            role="tab"
            type="button"
            aria-selected={activeTab === "published"}
            aria-controls="published-panel"
            id="published-tab"
            tabIndex={activeTab === "published" ? 0 : -1}
            onClick={() => setActiveTab("published")}
          >
            {messages.tabPublished}
            <span className="admin-tab-count">
              {formatTemplate(messages.counterVisible, { count: visibleOrder.length })}
            </span>
          </button>
          <button
            className={`admin-tab ${activeTab === "bin" ? "active" : ""}`}
            role="tab"
            type="button"
            aria-selected={activeTab === "bin"}
            aria-controls="bin-panel"
            id="bin-tab"
            tabIndex={activeTab === "bin" ? 0 : -1}
            onClick={() => setActiveTab("bin")}
          >
            {messages.tabBin}
            <span className="admin-tab-count">
              {formatTemplate(messages.counterHidden, { count: hiddenItems.length })}
            </span>
          </button>
        </div>

        <section
          id="published-panel"
          role="tabpanel"
          aria-labelledby="published-tab"
          className={activeTab === "published" ? "" : "visually-hidden"}
        >
          {activeTab === "published" && (
            <GalleryGrid
              messages={messages}
              ids={visibleOrder}
              isPublished
              disabled={saving}
              draggingId={draggingId}
              dropTargetId={dropTargetId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTargetId(null);
              }}
              onOpenModal={openModal}
              onHide={hide}
              onRestore={restore}
              onMove={moveVisible}
            />
          )}
        </section>

        <section
          id="bin-panel"
          role="tabpanel"
          aria-labelledby="bin-tab"
          className={activeTab === "bin" ? "" : "visually-hidden"}
        >
          {activeTab === "bin" && (
            <>
              {hiddenItems.length === 0 ? (
                <p className="admin-empty">{messages.emptyBin}</p>
              ) : (
                <GalleryGrid
                  messages={messages}
                  ids={hiddenItems}
                  isPublished={false}
                  disabled={saving}
                  draggingId={null}
                  dropTargetId={null}
                  onDragStart={() => {}}
                  onDragOver={() => {}}
                  onDrop={() => {}}
                  onDragEnd={() => {}}
                  onOpenModal={openModal}
                  onHide={hide}
                  onRestore={restore}
                  onMove={() => {}}
                />
              )}
            </>
          )}
        </section>
      </main>

      {modalId && (
        <ImageModal
          messages={messages}
          id={modalId}
          ids={currentFilterIds}
          isPublished={activeTab === "published"}
          disabled={saving}
          onClose={closeModal}
          onNavigate={navigateModal}
          onHide={hide}
          onRestore={restore}
          onMove={moveVisible}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
}

type GalleryGridProps = {
  messages: AdminMessages;
  ids: string[];
  isPublished: boolean;
  disabled: boolean;
  draggingId: string | null;
  dropTargetId: string | null;
  onDragStart: (id: string) => void;
  onDragOver: (draggedId: string, targetId: string | null) => void;
  onDrop: (draggedId: string, targetId: string) => void;
  onDragEnd: () => void;
  onOpenModal: (id: string, trigger: HTMLButtonElement | null) => void;
  onHide: (id: string) => void;
  onRestore: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};

function GalleryGrid({
  messages,
  ids,
  isPublished,
  disabled,
  draggingId,
  dropTargetId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onOpenModal,
  onHide,
  onRestore,
  onMove,
}: GalleryGridProps) {
  const pointerDragId = useRef<string | null>(null);
  const blockNativeDrag = useRef(false);

  const getPointerTargetId = (clientX: number, clientY: number) => {
    for (const element of document.elementsFromPoint(clientX, clientY)) {
      const card = element.closest<HTMLElement>("[data-gallery-id]");
      if (card?.dataset.galleryId) return card.dataset.galleryId;
    }
    return null;
  };

  return (
    <ul className="admin-grid" role="list" aria-label={isPublished ? messages.tabPublished : messages.tabBin}>
      {ids.map((id, index) => {
        const isHidden = !isPublished;
        return (
          <li
            key={id}
            data-gallery-id={id}
            draggable={isPublished && !disabled}
            className={`admin-card ${dropTargetId === id ? "drag-over" : ""} ${draggingId === id ? "is-dragging" : ""} ${isHidden ? "admin-card-hidden" : ""}`}
            onPointerDownCapture={(event) => {
              blockNativeDrag.current = Boolean(
                (event.target as HTMLElement).closest(".admin-card-actions"),
              );
            }}
            onPointerUpCapture={() => {
              blockNativeDrag.current = false;
            }}
            onPointerCancelCapture={() => {
              blockNativeDrag.current = false;
            }}
            onDragStart={(event) => {
              if (
                !isPublished ||
                disabled ||
                pointerDragId.current !== null ||
                blockNativeDrag.current
              ) {
                event.preventDefault();
                return;
              }
              event.dataTransfer.setData("text/plain", id);
              event.dataTransfer.effectAllowed = "move";
              onDragStart(id);
            }}
            onDragOver={(event) => {
              if (!isPublished || !draggingId) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              onDragOver(draggingId, id);
            }}
            onDrop={(event) => {
              event.preventDefault();
              const draggedId = event.dataTransfer.getData("text/plain") || draggingId;
              if (draggedId) onDrop(draggedId, id);
            }}
            onDragEnd={() => {
              blockNativeDrag.current = false;
              onDragEnd();
            }}
          >
            {isPublished && (
              <span
                className="admin-drag-handle"
                aria-hidden="true"
                title={`${messages.dragHandle} ${id}`}
                onPointerDown={(event) => {
                  if (
                    disabled ||
                    pointerDragId.current !== null ||
                    (event.pointerType === "mouse" && event.button !== 0)
                  ) return;
                  event.preventDefault();
                  pointerDragId.current = id;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  onDragStart(id);
                }}
                onPointerMove={(event) => {
                  if (pointerDragId.current !== id) return;

                  const targetId = getPointerTargetId(event.clientX, event.clientY);
                  onDragOver(id, targetId);

                  const edgeSize = 72;
                  if (event.clientY < edgeSize) {
                    window.scrollBy({ top: -12 });
                  } else if (event.clientY > window.innerHeight - edgeSize) {
                    window.scrollBy({ top: 12 });
                  }
                }}
                onPointerUp={(event) => {
                  if (pointerDragId.current !== id) return;
                  const targetId = getPointerTargetId(event.clientX, event.clientY);
                  pointerDragId.current = null;
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  if (targetId) {
                    onDrop(id, targetId);
                  } else {
                    onDragEnd();
                  }
                }}
                onPointerCancel={(event) => {
                  if (pointerDragId.current !== id) return;
                  pointerDragId.current = null;
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  onDragEnd();
                }}
                onLostPointerCapture={() => {
                  if (pointerDragId.current !== id) return;
                  pointerDragId.current = null;
                  onDragEnd();
                }}
              >
                <GripVertical aria-hidden="true" size={18} />
              </span>
            )}
            <button
              className="admin-card-media"
              type="button"
              aria-label={`${messages.openImage} ${id}`}
              onClick={(event) => onOpenModal(id, event.currentTarget)}
            >
              <Image
                src={getGalleryImageSrc(id)}
                alt={formatTemplate(messages.imageAlt, { number: id })}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 220px"
                quality={60}
                draggable={false}
              />
              <span className="admin-card-overlay" aria-hidden="true">
                <Eye size={20} />
                <span>{messages.openImage}</span>
              </span>
            </button>
            <div className="admin-card-footer">
              <span className="admin-card-number">#{id}</span>
              <span className="admin-card-position">
                {formatTemplate(messages.modalPosition, {
                  position: index + 1,
                  total: ids.length,
                })}
              </span>
            </div>
            <div className="admin-card-actions">
              {isPublished && (
                <>
                  <button
                    className="admin-icon-button"
                    type="button"
                    aria-label={`${messages.moveBackward} ${id}`}
                    title={`${messages.moveBackward} ${id}`}
                    onClick={() => onMove(id, -1)}
                    disabled={disabled || index === 0}
                  >
                    <ChevronLeft aria-hidden="true" size={18} />
                  </button>
                  <button
                    className="admin-icon-button"
                    type="button"
                    aria-label={`${messages.moveForward} ${id}`}
                    title={`${messages.moveForward} ${id}`}
                    onClick={() => onMove(id, 1)}
                    disabled={disabled || index === ids.length - 1}
                  >
                    <ChevronRight aria-hidden="true" size={18} />
                  </button>
                  <button
                    className="admin-icon-button admin-icon-button-danger"
                    type="button"
                    aria-label={`${messages.hide} ${id}`}
                    title={`${messages.hide} ${id}`}
                    onClick={() => onHide(id)}
                    disabled={disabled || ids.length === 1}
                  >
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                </>
              )}
              {!isPublished && (
                <button
                  className="admin-icon-button admin-icon-button-success"
                  type="button"
                  aria-label={`${messages.restore} ${id}`}
                  title={`${messages.restore} ${id}`}
                  onClick={() => onRestore(id)}
                  disabled={disabled}
                >
                  <RotateCcw aria-hidden="true" size={18} />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

type ImageModalProps = {
  messages: AdminMessages;
  id: string;
  ids: string[];
  isPublished: boolean;
  disabled: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onHide: (id: string) => void;
  onRestore: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function ImageModal({
  messages,
  id,
  ids,
  isPublished,
  disabled,
  onClose,
  onNavigate,
  onHide,
  onRestore,
  onMove,
  triggerRef,
}: ImageModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const currentIndex = ids.indexOf(id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < ids.length - 1;

  const navigatePrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigate(ids[currentIndex - 1]);
    }
  }, [hasPrevious, ids, currentIndex, onNavigate]);

  const navigateNext = useCallback(() => {
    if (hasNext) {
      onNavigate(ids[currentIndex + 1]);
    }
  }, [hasNext, ids, currentIndex, onNavigate]);

  useEffect(() => {
    titleRef.current?.focus();
  }, [id]);

  // Lock scroll and manage focus
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const triggerToRestore = triggerRef.current;
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (triggerToRestore?.isConnected) {
        triggerToRestore.focus();
      } else if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        document.querySelector<HTMLElement>("a, button")?.focus();
      }
    };
  }, [triggerRef]);

  // Keyboard handling: Escape, Tab trap, Arrow keys
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigatePrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateNext();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
        ).filter((element) => element.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, navigatePrevious, navigateNext]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const statusLabel = isPublished ? messages.statusVisible : messages.statusHidden;
  const statusIcon = isPublished ? <Eye aria-hidden="true" size={16} /> : <Trash2 aria-hidden="true" size={16} />;

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          ref={closeButtonRef}
          className="admin-modal-close"
          type="button"
          aria-label={messages.closeModal}
          onClick={onClose}
        >
          <X aria-hidden="true" size={22} />
        </button>

        <div className="admin-modal-body">
          <div className="admin-modal-image">
            <Image
              src={getGalleryImageSrc(id)}
              alt={formatTemplate(messages.imageAlt, { number: id })}
              fill
              sizes="100vw"
              quality={85}
              priority
            />

            {ids.length > 1 && (
              <>
                <button
                  className="admin-modal-nav admin-modal-nav-previous"
                  type="button"
                  aria-label={messages.previous}
                  onClick={navigatePrevious}
                  disabled={!hasPrevious}
                >
                  <ChevronLeft aria-hidden="true" size={28} />
                </button>
                <button
                  className="admin-modal-nav admin-modal-nav-next"
                  type="button"
                  aria-label={messages.next}
                  onClick={navigateNext}
                  disabled={!hasNext}
                >
                  <ChevronRight aria-hidden="true" size={28} />
                </button>
              </>
            )}
          </div>

          <aside className="admin-modal-sidebar">
            <div className="admin-modal-meta">
              <h2 id="modal-title" ref={titleRef} tabIndex={-1}>{messages.modalTitle}</h2>
              <p className="admin-modal-id">#{id}</p>
              <p className="admin-modal-position">
                {formatTemplate(messages.modalPosition, {
                  position: currentIndex + 1,
                  total: ids.length,
                })}
              </p>
              <span className={`admin-status-pill ${isPublished ? "visible" : "hidden"}`}>
                {statusIcon}
                {statusLabel}
              </span>
            </div>

            <div className="admin-modal-actions">
              {ids.length > 1 && (
                <div className="admin-modal-action-group">
                  <p>{messages.modalNavigation}</p>
                  <div className="admin-modal-button-row">
                    <button
                      className="admin-button"
                      type="button"
                      onClick={navigatePrevious}
                      disabled={!hasPrevious}
                    >
                      <ChevronLeft aria-hidden="true" size={16} />
                      {messages.previous}
                    </button>
                    <button
                      className="admin-button"
                      type="button"
                      onClick={navigateNext}
                      disabled={!hasNext}
                    >
                      {messages.next}
                      <ChevronRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {isPublished && (
                <div className="admin-modal-action-group">
                  <p>{messages.modalOrdering}</p>
                  <div className="admin-modal-button-row">
                    <button
                      className="admin-button"
                      type="button"
                      onClick={() => onMove(id, -1)}
                      disabled={disabled || currentIndex === 0}
                    >
                      <ChevronLeft aria-hidden="true" size={16} />
                      {messages.moveBackward}
                    </button>
                    <button
                      className="admin-button"
                      type="button"
                      onClick={() => onMove(id, 1)}
                      disabled={disabled || currentIndex === ids.length - 1}
                    >
                      {messages.moveForward}
                      <ChevronRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="admin-modal-action-group">
                <p>{isPublished ? messages.hide : messages.restore}</p>
                {isPublished ? (
                  <button
                    className="admin-button admin-button-danger"
                    type="button"
                    onClick={() => onHide(id)}
                    disabled={disabled || ids.length === 1}
                  >
                    <Trash2 aria-hidden="true" size={16} />
                    {messages.hide}
                  </button>
                ) : (
                  <button
                    className="admin-button admin-button-success"
                    type="button"
                    onClick={() => onRestore(id)}
                    disabled={disabled}
                  >
                    <RotateCcw aria-hidden="true" size={16} />
                    {messages.restore}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
