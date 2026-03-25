"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageViewer, { ViewerImage } from "@/components/ImageViewer";
import { fetchProjects, Project } from "@/lib/api";

type Category = "covers" | "branding" | "videos" | "affiches" | "miniatures" | "bannieres";

const CATEGORIES: Category[] = ["covers", "branding", "videos", "affiches", "miniatures", "bannieres"];

const SUBTABS: Partial<Record<Category, { solo: string; grouped: string }>> = {
  covers:     { solo: "singles",  grouped: "albums"    },
  branding:   { solo: "logos",    grouped: "brandings" },
  affiches:   { solo: "solo",     grouped: "packs"     },
  miniatures: { solo: "solo",     grouped: "packs"     },
};

const ASPECT: Record<Category, string> = {
  covers:     "1",
  branding:   "1",
  videos:     "16/9",
  affiches:   "3/4",
  miniatures: "16/9",
  bannieres:  "16/9",
};

const ASPECT_CLASS: Record<Category, string> = {
  covers:     "aspect-square",
  branding:   "aspect-square",
  videos:     "aspect-video",
  affiches:   "aspect-[3/4]",
  miniatures: "aspect-video",
  bannieres:  "aspect-video",
};

// "tout" grid: 3 cols for video-like categories, 2 mobile / 6 desktop for others
const THREE_COL_CATS: Category[] = ["videos", "miniatures", "bannieres"];

const CARD_GAP   = "clamp(0.4rem, 0.8vw, 0.75rem)";
const ROW_HEIGHT = "clamp(160px, 18vw, 260px)";

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily:    "Inter, sans-serif",
  fontWeight:    600,
  fontSize:      "clamp(0.72rem, 0.95vw, 1rem)",
  letterSpacing: "0.04em",
  padding:       "0.6rem 1.4rem",
  textTransform: "lowercase",
  transition:    "all 0.3s",
  cursor:        "pointer",
  border:        "none",
  color:         "#f5f3f7",
  ...(active
    ? { backgroundColor: "rgba(133,92,157,0.3)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", outline: "1px solid rgba(133,92,157,0.5)" }
    : { backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", outline: "1px solid rgba(255,255,255,0.18)" }),
});

/* ─────────────────────────────────────────────────────────
   Branding project viewer — horizontal scroll, no gap
───────────────────────────────────────────────────────── */
function BrandingProjectViewer({ images, label, onClose }: {
  images:  { url: string }[];
  label:   string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={onClose}>
    <div className="relative flex flex-col bg-black w-full h-full md:w-[60vw] md:h-[85vh] md:max-w-4xl" onClick={e => e.stopPropagation()}>
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.5)", letterSpacing: "0.08em", textTransform: "lowercase" }}>
          {label}
        </span>
        <button
          onClick={onClose}
          style={{ color: "#f5f3f7", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem" }}
        >
          ✕
        </button>
      </div>

      {/* vertical scroll — no gap, no snap, pure momentum scroll */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        data-lenis-prevent
        style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
      >
        {images.map((img, i) => (
          <div key={i} style={{ lineHeight: 0 }}>
            {img.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.url}
                alt={`${label} ${i + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Horizontal project viewer — albums & packs
───────────────────────────────────────────────────────── */
function HorizontalProjectViewer({ images, label, onClose }: {
  images:  { url: string }[];
  label:   string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="relative flex flex-col bg-black w-[92vw] h-[75vh] md:w-[85vw] md:h-[80vh] md:max-w-6xl" onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.5)", letterSpacing: "0.08em", textTransform: "lowercase" }}>
            {label}
          </span>
          <button onClick={onClose} style={{ color: "#f5f3f7", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem" }}>
            ✕
          </button>
        </div>

        {/* horizontal scroll */}
        <style>{`
          .horiz-scroll::-webkit-scrollbar { height: 4px; }
          .horiz-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
          .horiz-scroll::-webkit-scrollbar-thumb { background: rgba(133,92,157,0.6); }
          .horiz-scroll { scrollbar-width: thin; scrollbar-color: rgba(133,92,157,0.6) rgba(255,255,255,0.05); }
        `}</style>
        <div
          className="flex-1 horiz-scroll overflow-x-auto"
          data-lenis-prevent
          style={{ display: "flex", flexDirection: "row", alignItems: "stretch", overscrollBehavior: "contain" }}
        >
          {images.map((img, i) => (
            <div key={i} style={{ flexShrink: 0, height: "100%", lineHeight: 0 }}>
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={`${label} ${i + 1}`}
                  style={{ height: "100%", width: "auto", display: "block" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Draggable row
───────────────────────────────────────────────────────── */
function DragRow({ children }: { children: React.ReactNode }) {
  const ref        = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current     = e.pageX - ref.current.getBoundingClientRect().left;
    scrollLeft.current = ref.current.scrollLeft;
    ref.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.getBoundingClientRect().left;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (ref.current) ref.current.style.cursor = "grab";
  }, []);

  return (
    <div
      ref={ref}
      className="no-scrollbar"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      style={{ display: "flex", gap: CARD_GAP, overflowX: "auto", scrollbarWidth: "none", cursor: "grab", userSelect: "none" }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card
───────────────────────────────────────────────────────── */
function Card({ project, aspectClass, onOpen, index, allImages }: {
  project:    Project;
  aspectClass: string;
  onOpen:     (images: ViewerImage[], index: number) => void;
  index:      number;
  allImages:  ViewerImage[];
}) {
  const imgUrl = project.images[0]?.url || project.yt_thumbnail || undefined;
  return (
    <div
      className={`relative ${aspectClass} overflow-hidden group cursor-pointer`}
      style={{ backgroundColor: "#e8dff2", backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
      onClick={() => onOpen(allImages, index)}
    >
      {!imgUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{project.title}</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
        <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{project.title}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   All-images masonry grid — used for "tout"
   threeCol: true  → columns-3 on all sizes (videos/miniatures/bannieres)
   threeCol: false → 2 flex cols on mobile (aligned tops), columns-5 on desktop
───────────────────────────────────────────────────────── */
function AllImagesGrid({ projects, aspect, onOpen, threeCol = false, square = false }: {
  projects:  Project[];
  aspect:    string;
  onOpen:    (images: ViewerImage[], index: number) => void;
  threeCol?: boolean;
  square?:   boolean;
}) {
  const allImages: ViewerImage[] = projects
    .filter(p => p.images.length > 0 || p.yt_thumbnail)
    .map(p => ({
      src:             p.images[0]?.url || p.yt_thumbnail || "",
      label:           p.title || "",
      aspectRatio:     aspect,
      backgroundColor: "#e8dff2",
    }));

  if (allImages.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  // Square grid card (used when square=true — proper CSS grid, exact 6/2 per row)
  const SquareCard = ({ img, i }: { img: ViewerImage; i: number }) => (
    <div
      className="relative aspect-square overflow-hidden group cursor-pointer"
      style={{ backgroundColor: "#e8dff2" }}
      onClick={() => onOpen(allImages, i)}
    >
      {img.src
        ? // eslint-disable-next-line @next/next/no-img-element
          <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
          </div>
      }
      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
        <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
      </div>
    </div>
  );

  // Square mode — exact grid, 2 cols mobile / 6 cols desktop
  if (square) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: CARD_GAP }}>
        {allImages.map((img, i) => <SquareCard key={i} img={img} i={i} />)}
      </div>
    );
  }

  // 3-col masonry: same layout on all screen sizes
  if (threeCol) {
    return (
      <div className="columns-3" style={{ columnGap: CARD_GAP }}>
        {allImages.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden group cursor-pointer"
            style={{ backgroundColor: "#e8dff2", marginBottom: CARD_GAP, breakInside: "avoid" }}
            onClick={() => onOpen(allImages, i)}
          >
            {img.src
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
              : <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                </div>
            }
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
              <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Natural ratio masonry — 2 flex cols mobile (aligned tops) / 6 CSS columns desktop
  return (
    <>
      {/* Mobile — 2 flex columns interleaved */}
      <div className="md:hidden" style={{ display: "flex", gap: CARD_GAP }}>
        {[0, 1].map(col => (
          <div key={col} style={{ flex: 1, display: "flex", flexDirection: "column", gap: CARD_GAP }}>
            {allImages.filter((_, i) => i % 2 === col).map((img, idx) => {
              const globalIdx = idx * 2 + col;
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: "#e8dff2" }}
                  onClick={() => onOpen(allImages, globalIdx)}
                >
                  {img.src
                    ? // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
                    : <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                      </div>
                  }
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
                    <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Desktop — CSS columns-5 */}
      <div className="hidden md:block columns-5" style={{ columnGap: CARD_GAP }}>
        {allImages.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden group cursor-pointer"
            style={{ backgroundColor: "#e8dff2", marginBottom: CARD_GAP, breakInside: "avoid" }}
            onClick={() => onOpen(allImages, i)}
          >
            {img.src
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
              : <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                </div>
            }
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
              <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Card grid — solo projects (non-branding)
───────────────────────────────────────────────────────── */
function CardGrid({ projects, aspectClass, aspect, onOpen }: {
  projects:   Project[];
  aspectClass: string;
  aspect:     string;
  onOpen:     (images: ViewerImage[], index: number) => void;
}) {
  const cols = aspectClass === "aspect-square" || aspectClass === "aspect-[3/4]"
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const allImages: ViewerImage[] = projects.map(p => ({
    src:             p.images[0]?.url || p.yt_thumbnail || undefined,
    label:           p.title || "",
    aspectRatio:     aspect,
    backgroundColor: "#e8dff2",
  }));

  if (projects.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  return (
    <div className={`grid ${cols}`} style={{ gap: CARD_GAP }}>
      {projects.map((p, i) => (
        <Card key={p.id} project={p} aspectClass={aspectClass} onOpen={onOpen} index={i} allImages={allImages} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Video grid + viewer
───────────────────────────────────────────────────────── */
function extractVideoId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["jan","fév","mars","avr","mai","juin","juil","août","sep","oct","nov","déc"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function VideoViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  const videoId = extractVideoId(project.youtube_url || "");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "-2.5rem", right: 0, background: "none", border: "none", color: "#f5f3f7", fontSize: "1.5rem", cursor: "pointer", opacity: 0.7, fontFamily: "Inter, sans-serif" }}
        >
          ✕
        </button>

        {/* Iframe */}
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        {/* Meta */}
        <div style={{ paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(0.85rem,1.2vw,1rem)", color: "#f5f3f7", textTransform: "lowercase" }}>
            {project.yt_title || project.title}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,243,247,0.45)", letterSpacing: "0.04em" }}>
            {formatViews(project.yt_views)} vues · {formatDate(project.yt_published)}
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ projects }: { projects: Project[] }) {
  const [playing, setPlaying] = useState<Project | null>(null);

  if (projects.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: CARD_GAP }}>
        {projects.map(p => {
          const thumb = p.yt_thumbnail || p.images[0]?.url;
          return (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", cursor: "pointer" }} onClick={() => setPlaying(p)}>
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden group" style={{ backgroundColor: "#e8dff2" }}>
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(133,92,157,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: "1.1rem", marginLeft: 3 }}>▶</span>
                  </div>
                </div>
              </div>
              {/* Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(0.8rem,1vw,0.95rem)", color: "#f5f3f7", textTransform: "lowercase", lineHeight: 1.3 }}>
                  {p.yt_title || p.title}
                </span>
                {(p.yt_views > 0 || p.yt_published) && (
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.4)", letterSpacing: "0.04em" }}>
                    {p.yt_views > 0 && `${formatViews(p.yt_views)} vues`}
                    {p.yt_views > 0 && p.yt_published && " · "}
                    {p.yt_published && formatDate(p.yt_published)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {playing && <VideoViewer project={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Branding grid — first image per project/group, Behance-style
   Clicking opens BrandingProjectViewer
───────────────────────────────────────────────────────── */
interface BrandingItem {
  id:         string | number;
  firstImage: string | undefined;
  label:      string;
  images:     { url: string }[];
}

function BrandingGrid({ items, onOpen, aspectRatio = "5/4", cols = "grid-cols-1 md:grid-cols-3" }: {
  items:        BrandingItem[];
  onOpen:       (images: { url: string }[], label: string) => void;
  aspectRatio?: string;
  cols?:        string;
}) {
  if (items.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  return (
    <div className={`grid ${cols}`} style={{ gap: "clamp(1rem, 2vw, 1.5rem)" }}>
      {items.map(item => (
        <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div
            className="relative w-full overflow-hidden group cursor-pointer"
            style={{
              aspectRatio:        aspectRatio,
              backgroundColor:    "#e8dff2",
              backgroundImage:    item.firstImage ? `url(${item.firstImage})` : undefined,
              backgroundSize:     "cover",
              backgroundPosition: "center",
            }}
            onClick={() => onOpen(item.images, item.label)}
          >
            {!item.firstImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }} />
          </div>
          {item.label && (
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(0.6rem, 0.85vw, 0.75rem)", letterSpacing: "0.06em", color: "rgba(245,243,247,0.6)", textTransform: "lowercase" }}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Rows view — grouped projects (non-branding)
───────────────────────────────────────────────────────── */
function RowsView({ projects, aspect, onOpen }: {
  projects: Project[];
  aspect:   string;
  onOpen:   (images: ViewerImage[], index: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
      {projects.map((project) => {
        const label   = project.title;
        const allImgs = project.images.map(img => ({ url: img.url, title: label }));
        const rowImages: ViewerImage[] = allImgs.map(img => ({
          src: img.url, label: img.title, aspectRatio: aspect, backgroundColor: "#e8dff2",
        }));
        return (
          <div key={project.id} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <DragRow>
              {allImgs.map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden flex-shrink-0 group cursor-pointer"
                  style={{ backgroundColor: "#e8dff2", height: ROW_HEIGHT, width: ROW_HEIGHT }}
                  onClick={() => onOpen(rowImages, i)}
                >
                  {img.url
                    ? // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    : <div className="absolute inset-0 flex items-center justify-center"><span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.title}</span></div>
                  }
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
                    <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.title}</span>
                  </div>
                </div>
              ))}
            </DragRow>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)", letterSpacing: "0.06em", color: "#f5f3f7", textTransform: "lowercase" }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────── */
interface ViewerState        { images: ViewerImage[];       index: number; }
interface BrandingViewerState { images: { url: string }[]; label: string; }

function PortfolioContent() {
  const { t }        = useI18n();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initial      = (searchParams.get("category") as Category) || "covers";

  const [active,         setActive]         = useState<Category>(initial);
  const [sub,            setSub]            = useState<string | null>(null);
  const [projects,       setProjects]       = useState<Project[]>([]);
  const [viewer,            setViewer]            = useState<ViewerState | null>(null);
  const [brandingViewer,    setBrandingViewer]    = useState<BrandingViewerState | null>(null);
  const [horizontalViewer,  setHorizontalViewer]  = useState<BrandingViewerState | null>(null);

  const openViewer = useCallback((images: ViewerImage[], index: number) => setViewer({ images, index }), []);

  useEffect(() => {
    const cat = searchParams.get("category") as Category;
    if (cat && CATEGORIES.includes(cat)) { setActive(cat); setSub(null); }
  }, [searchParams]);

  useEffect(() => {
    fetchProjects(active).then(setProjects);
    setSub(null);
  }, [active]);

  const switchCategory = (cat: Category) => {
    setActive(cat);
    router.replace(`/portfolio?category=${cat}`, { scroll: false });
  };

  const subtabs = SUBTABS[active] ?? null;

  const SUB_TYPE_SOLO:    Partial<Record<Category, string>> = {
    covers: "single", branding: "logo", affiches: "affiche", miniatures: "miniature",
  };
  const SUB_TYPE_GROUPED: Partial<Record<Category, string>> = {
    covers: "album", branding: "branding", affiches: "pack", miniatures: "minipack",
  };

  const soloProjects    = projects.filter(p => p.sub_type === SUB_TYPE_SOLO[active]);
  const groupedProjects = projects.filter(p => p.sub_type === SUB_TYPE_GROUPED[active]);

  const threeCol = THREE_COL_CATS.includes(active);

  // Items for BrandingGrid
  const brandingLogoItems: BrandingItem[] = soloProjects.map(p => ({
    id: p.id, firstImage: p.images[0]?.url, label: p.title, images: p.images,
  }));
  const brandingGroupItems: BrandingItem[] = groupedProjects.map(p => ({
    id: p.id, firstImage: p.images[0]?.url, label: p.title, images: p.images,
  }));

  const renderContent = () => {
    // ── tout ────────────────────────────────────────────
    if (sub === null) {
      if (active === "videos")   return <VideoGrid projects={projects} />;
      if (active === "branding") {
        const visibleProjects = projects.filter(p => p.images.length > 0 || p.yt_thumbnail);
        return <AllImagesGrid
          projects={visibleProjects}
          aspect={ASPECT[active]}
          onOpen={(_, i) => {
            const p = visibleProjects[i];
            if (p) setBrandingViewer({ images: p.images, label: p.title });
          }}
          square
        />;
      }
      return projects.length > 0
        ? <AllImagesGrid projects={projects} aspect={ASPECT[active]} onOpen={openViewer} threeCol={threeCol} square={active === "branding" || active === "covers"} />
        : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet dans cette catégorie</p>;
    }

    // ── solo sub-tab ─────────────────────────────────────
    if (sub === subtabs?.solo) {
      if (active === "branding") {
        return <BrandingGrid items={brandingLogoItems} onOpen={(imgs, lbl) => setBrandingViewer({ images: imgs, label: lbl })} />;
      }
      if (active === "videos") return <VideoGrid projects={soloProjects} />;
      return soloProjects.length > 0
        ? <CardGrid projects={soloProjects} aspectClass={ASPECT_CLASS[active]} aspect={ASPECT[active]} onOpen={openViewer} />
        : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet solo</p>;
    }

    // ── grouped sub-tab ──────────────────────────────────
    if (sub === subtabs?.grouped) {
      if (active === "branding") {
        return <BrandingGrid items={brandingGroupItems} onOpen={(imgs, lbl) => setBrandingViewer({ images: imgs, label: lbl })} />;
      }
      if (active === "covers" || active === "affiches") {
        const items: BrandingItem[] = groupedProjects.map(p => ({
          id: p.id, firstImage: p.images[0]?.url, label: p.title, images: p.images,
        }));
        return <BrandingGrid
          items={items}
          aspectRatio={active === "covers" ? "1" : "3/4"}
          cols="grid-cols-2 md:grid-cols-5"
          onOpen={(imgs, lbl) => setHorizontalViewer({ images: imgs, label: lbl })}
        />;
      }
      return groupedProjects.length > 0
        ? <RowsView projects={groupedProjects} aspect={ASPECT[active]} onOpen={openViewer} />
        : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun groupe</p>;
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Nav />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(clamp(1rem,2vw,2.5rem),1fr) minmax(0,100rem) minmax(clamp(1rem,2vw,2.5rem),1fr)", paddingTop: "7rem", paddingBottom: "6rem" }}>
        <div style={{ gridColumn: 2, display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3rem)" }}>

          <h1 style={{ fontFamily: "austin-pen, cursive", fontSize: "clamp(2.8rem,9vw,7rem)", color: "#f5f3f7", lineHeight: 1, textAlign: "center" }}>
            {t("portfolio.title")}
          </h1>

          {/* Category tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", borderBottom: "1px solid rgba(133,92,157,0.15)", paddingBottom: "1.5rem" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => switchCategory(cat)} style={tabStyle(active === cat)}>
                {t(`portfolio.categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Sub-tabs */}
          {subtabs && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              <button onClick={() => setSub(null)}            style={tabStyle(sub === null)}>tout</button>
              <button onClick={() => setSub(subtabs.solo)}    style={tabStyle(sub === subtabs.solo)}>{subtabs.solo}</button>
              <button onClick={() => setSub(subtabs.grouped)} style={tabStyle(sub === subtabs.grouped)}>{subtabs.grouped}</button>
            </div>
          )}

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3rem)" }}>
            {renderContent()}
          </div>

          {/* Back */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="/#portfolio"
              style={{ padding: "0.6rem 1.5rem", fontSize: "clamp(0.72rem,0.95vw,1rem)", fontFamily: "Inter, sans-serif", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", color: "var(--white)", textTransform: "lowercase", textDecoration: "none", letterSpacing: "0.04em", transition: "all 0.3s", borderRadius: "0" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
            >
              retour
            </a>
          </div>

        </div>
      </div>

      <Footer />

      {viewer && (
        <ImageViewer images={viewer.images} initialIndex={viewer.index} onClose={() => setViewer(null)} />
      )}
      {brandingViewer && (
        <BrandingProjectViewer
          images={brandingViewer.images}
          label={brandingViewer.label}
          onClose={() => setBrandingViewer(null)}
        />
      )}
      {horizontalViewer && (
        <HorizontalProjectViewer
          images={horizontalViewer.images}
          label={horizontalViewer.label}
          onClose={() => setHorizontalViewer(null)}
        />
      )}
    </main>
  );
}

export default function PortfolioPage() {
  return <Suspense><PortfolioContent /></Suspense>;
}
