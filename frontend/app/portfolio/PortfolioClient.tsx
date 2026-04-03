"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageViewer, { ViewerImage } from "@/components/ImageViewer";
import { fetchProjects, Project } from "@/lib/api";

type Category = "covers" | "branding" | "videos" | "affiches" | "miniatures" | "bannieres";

const CATEGORIES: Category[] = ["covers", "branding", "videos", "affiches", "miniatures", "bannieres"];

const SUBTABS: Partial<Record<Category, { solo: string; grouped: string }>> = {
  covers:   { solo: "singles", grouped: "albums"    },
  branding: { solo: "logos",   grouped: "brandings" },
  affiches: { solo: "affiche", grouped: "pack"      },
};

const ASPECT: Record<Category, string> = {
  covers:     "1",
  branding:   "1",
  videos:     "16/9",
  affiches:   "4/5",
  miniatures: "16/9",
  bannieres:  "16/9",
};

const ASPECT_CLASS: Record<Category, string> = {
  covers:     "aspect-square",
  branding:   "aspect-square",
  videos:     "aspect-video",
  affiches:   "aspect-[4/5]",
  miniatures: "aspect-video",
  bannieres:  "aspect-video",
};

// "tout" grid: 3 cols for video-like categories (bannieres handled separately)
const THREE_COL_CATS: Category[] = ["videos"];

const CARD_GAP   = "clamp(0.4rem, 0.8vw, 0.75rem)";
const ROW_HEIGHT = "clamp(160px, 18vw, 260px)";

// Cloudinary URL optimiser — inserts transform before the version segment
function cl(url: string | undefined, w = 800): string | undefined {
  if (!url) return undefined;
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/q_auto,f_auto,w_${w}/`);
}

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
    document.body.style.overflow           = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.dataset.viewerOpen       = "1";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow           = "";
      document.body.style.overscrollBehavior = "";
      delete document.body.dataset.viewerOpen;
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
      <style>{`
        .branding-vscroll::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .branding-vscroll::-webkit-scrollbar { display: block; width: 4px; }
          .branding-vscroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
          .branding-vscroll::-webkit-scrollbar-thumb { background: rgba(133,92,157,0.6); border-radius: 2px; }
          .branding-vscroll { scrollbar-width: thin; scrollbar-color: rgba(133,92,157,0.6) rgba(255,255,255,0.05); }
        }
      `}</style>
      <div
        className="flex-1 overflow-y-auto branding-vscroll"
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
   Horizontal project viewer — albums & packs (Instagram carousel)
───────────────────────────────────────────────────────── */
function HorizontalProjectViewer({ images, label, initialIndex = 0, onClose }: {
  images:        { url: string }[];
  label:         string;
  initialIndex?: number;
  onClose:       () => void;
}) {
  const [curIdx, setCurIdx] = useState(initialIndex);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Body lock + keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  scrollToIndex(curIdx - 1);
      if (e.key === "ArrowRight") scrollToIndex(curIdx + 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow           = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.dataset.viewerOpen       = "1";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow           = "";
      document.body.style.overscrollBehavior = "";
      delete document.body.dataset.viewerOpen;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, curIdx]);

  // Jump to initialIndex instantly (rAF so layout is settled)
  useEffect(() => {
    if (!scrollRef.current) return;
    requestAnimationFrame(() => {
      if (scrollRef.current)
        scrollRef.current.scrollLeft = initialIndex * scrollRef.current.clientWidth;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scrollend + debounce fallback for index detection
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurIdx(Math.min(Math.max(idx, 0), images.length - 1));
    };
    const onScrollEnd = () => { if (debounceRef.current) clearTimeout(debounceRef.current); sync(); };
    const onScroll    = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(sync, 80);
    };
    el.addEventListener("scrollend", onScrollEnd);
    el.addEventListener("scroll",    onScroll,    { passive: true });
    return () => {
      el.removeEventListener("scrollend", onScrollEnd);
      el.removeEventListener("scroll",    onScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [images.length]);

  const scrollToIndex = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.min(Math.max(i, 0), images.length - 1);
    scrollRef.current.scrollTo({ left: clamped * scrollRef.current.clientWidth, behavior: "smooth" });
  }, [images.length]);

  // Sync active thumbnail into view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const thumb = thumbsRef.current.children[curIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [curIdx]);

  const showThumbs = images.length > 1;

  const btnStyle: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 20,
    padding: "0.5rem 0.9rem", alignItems: "center", justifyContent: "center",
    background: "rgba(12,12,12,0.55)", border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)", color: "#f5f3f7",
    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "1.1rem",
    cursor: "pointer", transition: "background 0.2s",
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <style>{`.hpv-scroll::-webkit-scrollbar { display: none; }`}</style>

      {/* ── Header — absolute overlay ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          backgroundColor: "#0c0c0c",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.75rem 1.25rem", flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.5)", textTransform: "lowercase" }}>
          {label}
          {showThumbs && <span style={{ color: "rgba(245,243,247,0.3)" }}> — {curIdx + 1}/{images.length}</span>}
        </span>
        <button
          onClick={onClose}
          style={{ color: "#f5f3f7", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem" }}
        >
          ✕
        </button>
      </div>

      {/* ── Carousel — fills full viewport ── */}
      <div
        ref={scrollRef}
        className="hpv-scroll"
        data-lenis-prevent
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", inset: 0,
          display: "flex",
          overflowX: "scroll",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingTop: "3.5rem",
          paddingBottom: showThumbs ? "4rem" : 0,
          transform: "translateZ(0)",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "100%",
              height: "100%",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {img.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.url}
                alt={`${label} ${i + 1}`}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Prev / Next arrows — desktop only ── */}
      {images.length > 1 && (
        <button
          className="hidden md:flex"
          style={{ ...btnStyle, left: "clamp(0.5rem, 2vw, 1.5rem)" }}
          onClick={e => { e.stopPropagation(); scrollToIndex(curIdx - 1); }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.45)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.55)")}
        >
          ‹
        </button>
      )}
      {images.length > 1 && (
        <button
          className="hidden md:flex"
          style={{ ...btnStyle, right: "clamp(0.5rem, 2vw, 1.5rem)" }}
          onClick={e => { e.stopPropagation(); scrollToIndex(curIdx + 1); }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.45)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.55)")}
        >
          ›
        </button>
      )}

      {/* ── Thumbnail strip — absolute at bottom ── */}
      {showThumbs && (
        <div
          ref={thumbsRef}
          className="hpv-scroll"
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
            backgroundColor: "#0c0c0c",
            display: "flex",
            gap: "0.35rem",
            padding: "0.5rem 1rem 0.75rem",
            overflowX: "auto",
            justifyContent: "center",
            scrollbarWidth: "none",
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => scrollToIndex(i)}
              style={{
                width: 64, height: 36,
                flexShrink: 0,
                cursor: "pointer",
                opacity: i === curIdx ? 1 : 0.4,
                outline: i === curIdx ? "2px solid #855c9d" : "2px solid transparent",
                backgroundColor: "#0c0c0c",
                overflow: "hidden",
                transition: "opacity 0.2s, outline 0.2s",
              }}
            >
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
          ))}
        </div>
      )}
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
      style={{ backgroundColor: "#0c0c0c", backgroundImage: imgUrl ? `url(${imgUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
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
      <a href={`/portfolio/${project.id}`} className="sr-only">{project.title}</a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   All-images masonry grid — used for "tout"
   threeCol: true  → columns-3 on all sizes (videos/miniatures/bannieres)
   threeCol: false → 2 flex cols on mobile (aligned tops), columns-5 on desktop
───────────────────────────────────────────────────────── */
function AllImagesGrid({ projects, aspect, onOpen, onOpenPack, onOpenProject, threeCol = false, square = false, colsClass }: {
  projects:       Project[];
  aspect:         string;
  onOpen:         (images: ViewerImage[], index: number) => void;
  onOpenPack?:    (images: ViewerImage[]) => void;
  onOpenProject?: (project: Project, index: number, allProjects: Project[]) => void;
  threeCol?:      boolean;
  square?:        boolean;
  colsClass?:     string;
}) {
  const filteredProjects = projects.filter(p => p.images.length > 0 || p.yt_thumbnail);
  const allImages: ViewerImage[] = filteredProjects.map(p => ({
    src:             p.images[0]?.url || p.yt_thumbnail || "",
    label:           p.title || "",
    aspectRatio:     aspect,
    backgroundColor: "#0c0c0c",
  }));

  if (allImages.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  const handleClick = (i: number) => {
    const p = filteredProjects[i];
    if (onOpenProject) {
      onOpenProject(p, i, filteredProjects);
      return;
    }
    if (onOpenPack && p && p.images.length > 1) {
      const packImages: ViewerImage[] = p.images.map(img => ({
        src: img.url, label: p.title || "", aspectRatio: aspect, backgroundColor: "#0c0c0c",
      }));
      onOpenPack(packImages);
    } else {
      onOpen(allImages, i);
    }
  };

  // Square grid card (used when square=true — proper CSS grid, exact 6/2 per row)
  const SquareCard = ({ img, i, projectId }: { img: ViewerImage; i: number; projectId: number }) => (
    <div
      className="relative aspect-square overflow-hidden group cursor-pointer"
      style={{ backgroundColor: "#0c0c0c" }}
      onClick={() => handleClick(i)}
    >
      {img.src
        ? // eslint-disable-next-line @next/next/no-img-element
          <img src={img.src} alt={img.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
          </div>
      }
      <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
        <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
      </div>
      <a href={`/portfolio/${projectId}`} className="sr-only">{img.label}</a>
    </div>
  );

  // Square mode — exact grid, 2 cols mobile / 3 mid / 5 desktop
  if (square) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: CARD_GAP }}>
        {allImages.map((img, i) => <SquareCard key={i} img={img} i={i} projectId={filteredProjects[i].id} />)}
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
            style={{ backgroundColor: "#0c0c0c", marginBottom: CARD_GAP, breakInside: "avoid" }}
            onClick={() => handleClick(i)}
          >
            {img.src
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt={img.label} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
              : <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                </div>
            }
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
              <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
            </div>
            <a href={`/portfolio/${filteredProjects[i].id}`} className="sr-only">{img.label}</a>
          </div>
        ))}
      </div>
    );
  }

  // Unified grid — default 2 cols mobile / 5 cols desktop, or custom colsClass
  return (
    <div className={`grid ${colsClass ?? "grid-cols-2 md:grid-cols-5"}`} style={{ gap: CARD_GAP }}>
      {allImages.map((img, i) => (
        <div
          key={i}
          className="relative overflow-hidden group cursor-pointer"
          style={{ backgroundColor: "#0c0c0c", aspectRatio: aspect || "3/4" }}
          onClick={() => handleClick(i)}
        >
          {img.src
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={img.src} alt={img.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
              </div>
          }
          <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }}>
            <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
          </div>
          <a href={`/portfolio/${filteredProjects[i].id}`} className="sr-only">{img.label}</a>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card grid — solo projects (non-branding)
───────────────────────────────────────────────────────── */
function CardGrid({ projects, aspectClass, aspect, onOpen, onOpenProject }: {
  projects:   Project[];
  aspectClass: string;
  aspect:     string;
  onOpen:     (images: ViewerImage[], index: number) => void;
  onOpenProject?: (project: Project, index: number, allProjects: Project[]) => void;
}) {
  const cols = aspectClass === "aspect-square" || aspectClass === "aspect-[3/4]" || aspectClass === "aspect-[4/5]"
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const allImages: ViewerImage[] = projects.map(p => ({
    src:             p.images[0]?.url || p.yt_thumbnail || undefined,
    label:           p.title || "",
    aspectRatio:     aspect,
    backgroundColor: "#0c0c0c",
  }));

  if (projects.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  const effectiveOpen: (images: ViewerImage[], i: number) => void = onOpenProject
    ? (_imgs, i) => onOpenProject(projects[i], i, projects)
    : onOpen;

  return (
    <div className={`grid ${cols}`} style={{ gap: CARD_GAP }}>
      {projects.map((p, i) => (
        <Card key={p.id} project={p} aspectClass={aspectClass} onOpen={effectiveOpen} index={i} allImages={allImages} />
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
          const thumb = p.thumbnail_url || p.yt_thumbnail || p.images[0]?.url;
          return (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", cursor: "pointer", position: "relative" }} onClick={() => setPlaying(p)}>
              <a href={`/portfolio/${p.id}`} className="sr-only">{p.yt_title || p.title}</a>
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden group" style={{ backgroundColor: "#0c0c0c" }}>
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={p.yt_title || p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
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

function BrandingGrid({ items, onOpen, aspectRatio = "5/4", cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }: {
  items:        BrandingItem[];
  onOpen:       (images: { url: string }[], label: string, index: number) => void;
  aspectRatio?: string;
  cols?:        string;
}) {
  if (items.length === 0) return (
    <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>
      aucun projet dans cette catégorie
    </p>
  );

  return (
    <div className={`grid ${cols}`} style={{ columnGap: CARD_GAP, rowGap: "clamp(1.5rem, 2.5vw, 2rem)" }}>
      {items.map((item, itemIdx) => (
        <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div
            className="relative w-full overflow-hidden group cursor-pointer"
            style={{ aspectRatio: aspectRatio, backgroundColor: "#0c0c0c" }}
            onClick={() => onOpen(item.images, item.label, itemIdx)}
          >
            {item.firstImage
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={cl(item.firstImage, 800)} alt={item.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              : <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                </div>
            }
            <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.2)" }} />
            <a href={`/portfolio/${item.id}`} className="sr-only">{item.label}</a>
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
          src: img.url, label: img.title, aspectRatio: aspect, backgroundColor: "#0c0c0c",
        }));
        return (
          <div key={project.id} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <a href={`/portfolio/${project.id}`} className="sr-only">{project.title}</a>
            <DragRow>
              {allImgs.map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden flex-shrink-0 group cursor-pointer"
                  style={{ backgroundColor: "#0c0c0c", height: ROW_HEIGHT, aspectRatio: aspect || "1" }}
                  onClick={() => onOpen(rowImages, i)}
                >
                  {img.url
                    ? // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={img.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
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
   Project Navigator — flat snap carousel
   • Singles / logos / album images → 1 horizontal slide per image
   • Branding projects              → 1 horizontal slide with vertical scroll inside
   • Album slides show thumbnail strip at bottom; singles/branding don't
   Desktop: prev/next text buttons; Mobile: swipe only (no buttons)
───────────────────────────────────────────────────────── */
interface ProjectNavState { projects: Project[]; projectIndex: number; }

interface Slide {
  projectIdx: number;
  imageIdx:   number;
  url:        string;
  title:      string;
  imageCount: number;
  isBranding: boolean;
  allImages:  { url: string }[];
}

function ProjectNavigator({ projects, projectIndex, onClose }: ProjectNavState & { onClose: () => void }) {
  const slides: Slide[] = projects.flatMap((p, pIdx) => {
    const isBranding = p.sub_type === "branding";
    const allImages  = p.images;

    if (isBranding) {
      // One slide for the whole branding project (vertical scroll inside)
      const s: Slide = {
        projectIdx: pIdx, imageIdx: 0,
        url: allImages[0]?.url || "", title: p.title,
        imageCount: allImages.length, isBranding, allImages,
      };
      return [s];
    }

    const imgs = allImages.length > 0 ? allImages : (p.yt_thumbnail ? [{ url: p.yt_thumbnail }] : []);
    if (imgs.length === 0) return [];
    return imgs.map((img, iIdx): Slide => ({
      projectIdx: pIdx, imageIdx: iIdx,
      url: img.url, title: p.title,
      imageCount: imgs.length, isBranding, allImages: imgs,
    }));
  });

  const initialSlide = Math.max(0, slides.findIndex(s => s.projectIdx === projectIndex));
  const [curIdx, setCurIdx] = useState(initialSlide);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const thumbsRef  = useRef<HTMLDivElement>(null);

  // Jump to initial slide on mount — rAF ensures layout is complete before reading clientWidth
  useEffect(() => {
    if (initialSlide === 0) return;
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft = initialSlide * scrollRef.current.clientWidth;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    // Detect settled index via scrollend (fires after snap) + debounce fallback
    const updateIdx = () => {
      if (!scrollRef.current) return;
      setCurIdx(c => {
        const next = Math.round(scrollRef.current!.scrollLeft / scrollRef.current!.clientWidth);
        return Math.min(Math.max(next, 0), slides.length - 1) !== c
          ? Math.min(Math.max(next, 0), slides.length - 1)
          : c;
      });
    };
    let debounce: ReturnType<typeof setTimeout>;
    const onScroll = () => { clearTimeout(debounce); debounce = setTimeout(updateIdx, 80); };
    el?.addEventListener("scrollend", updateIdx);
    el?.addEventListener("scroll",    onScroll);

    // Keyboard navigation
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (!scrollRef.current) return;
      const cur = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      if (e.key === "ArrowLeft")  scrollTo(cur - 1);
      if (e.key === "ArrowRight") scrollTo(cur + 1);
    };
    window.addEventListener("keydown", onKey);

    // Prevent pull-to-refresh — iOS Safari ignores overscrollBehavior on children,
    // must be set on body
    document.body.style.overflow           = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.dataset.viewerOpen       = "1";

    return () => {
      el?.removeEventListener("scrollend", updateIdx);
      el?.removeEventListener("scroll",    onScroll);
      clearTimeout(debounce);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow           = "";
      document.body.style.overscrollBehavior = "";
      delete document.body.dataset.viewerOpen;
    };
  }, [onClose, slides.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTo = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.min(Math.max(i, 0), slides.length - 1);
    scrollRef.current.scrollTo({ left: clamped * scrollRef.current.clientWidth, behavior: "smooth" });
    setCurIdx(clamped);
  }, [slides.length]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const slide = slides[curIdx];
    if (!slide || slide.imageCount <= 1 || slide.isBranding) return;
    (thumbsRef.current.children[slide.imageIdx] as HTMLElement | undefined)
      ?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [curIdx, slides]);

  const slide = slides[curIdx];
  if (!slide) return null;

  const showThumbs        = slide.imageCount > 1 && !slide.isBranding;
  const hasAnyThumbnails  = slides.some(s => s.imageCount > 1 && !s.isBranding);
  // First slide index of the current project (for thumbnail click → scrollTo)
  const projectStartIdx = slides.findIndex(s => s.projectIdx === slide.projectIdx);

  // Fix #2: no display in btnStyle — let className="hidden md:flex" control it
  const btnStyle: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 30,
    alignItems: "center", justifyContent: "center",
    padding: "1rem 0.75rem",
    background: "rgba(12,12,12,0.7)", border: "none",
    backdropFilter: "blur(10px)", color: "#f5f3f7",
    fontWeight: 300, fontSize: "1.6rem", lineHeight: 1,
    cursor: "pointer", transition: "background 0.2s",
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <style>{`
        .proj-snap::-webkit-scrollbar { display: none; }
        .brand-proj-scroll::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .brand-proj-scroll::-webkit-scrollbar { display: block; width: 4px; }
          .brand-proj-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
          .brand-proj-scroll::-webkit-scrollbar-thumb { background: rgba(133,92,157,0.6); border-radius: 2px; }
          .brand-proj-scroll { scrollbar-width: thin; scrollbar-color: rgba(133,92,157,0.6) rgba(255,255,255,0.05); }
        }
        .thumb-strip::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Carousel — full viewport so image is always centered in the page ── */}
      <div
        ref={scrollRef}
        className="proj-snap"
        data-lenis-prevent
        style={{
          position: "absolute", inset: 0,
          display: "flex",
          overflowX: "scroll", overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          overscrollBehavior: "contain",
          transform: "translateZ(0)",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0, width: "100%", height: "100%",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              // Reserve space for header (top) and thumbnail strip (bottom) — constant
              // values so the image zone never shifts regardless of UI around it
              paddingTop: s.isBranding ? 0 : "3.5rem",
              paddingBottom: hasAnyThumbnails ? "4rem" : 0,
            }}
          >
            {s.isBranding ? (
              <div className="w-full h-full md:w-[60vw] md:h-[85vh] md:max-w-4xl flex-shrink-0"
                style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                <div className="brand-proj-scroll" data-lenis-prevent
                  style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingTop: "2.6rem" }}
                >
                  {s.allImages.map((img, ii) => (
                    <div key={ii} style={{ lineHeight: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {img.url && <img src={img.url} alt={`${s.title} ${ii + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />}
                    </div>
                  ))}
                </div>
              </div>
            ) : s.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.url} alt={s.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
            ) : (
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.8rem", color: "rgba(133,92,157,0.4)" }}>{s.title}</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Header — overlaid at top, solid bg so it's readable over the image ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          backgroundColor: "#0c0c0c",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.5)", textTransform: "lowercase" }}>
          {slide.title}
          {showThumbs && <span style={{ color: "rgba(245,243,247,0.3)" }}> — {slide.imageIdx + 1}/{slide.imageCount}</span>}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {projects.length > 1 && (
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.3)", letterSpacing: "0.06em" }}>
              {slide.projectIdx + 1} / {projects.length}
            </span>
          )}
          <button onClick={onClose} style={{ color: "#f5f3f7", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem" }}>✕</button>
        </div>
      </div>

      {/* ── Thumbnail strip — overlaid at bottom, only visible for albums ── */}
      {showThumbs && (
        <div
          ref={thumbsRef}
          className="thumb-strip"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
            display: "flex", gap: "0.35rem",
            padding: "0.5rem 1rem 0.75rem",
            overflowX: "auto", justifyContent: "center",
            scrollbarWidth: "none",
            backgroundColor: "#0c0c0c",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {slide.allImages.map((img, ii) => (
            <div
              key={ii}
              onClick={() => scrollTo(projectStartIdx + ii)}
              style={{
                width: 64, height: 36, flexShrink: 0, cursor: "pointer",
                opacity: ii === slide.imageIdx ? 1 : 0.4,
                outline: ii === slide.imageIdx ? "2px solid #855c9d" : "2px solid transparent",
                backgroundColor: "#0c0c0c", overflow: "hidden",
                transition: "opacity 0.2s, outline 0.2s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img.url && <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
          ))}
        </div>
      )}

      {/* ── Desktop prev/next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            className="hidden md:flex"
            style={{ ...btnStyle, left: 0 }}
            onClick={() => scrollTo(curIdx - 1)}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.7)")}
          >‹</button>
          <button
            className="hidden md:flex"
            style={{ ...btnStyle, right: 0 }}
            onClick={() => scrollTo(curIdx + 1)}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.7)")}
          >›</button>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────── */
interface ViewerState        { images: ViewerImage[];       index: number; showThumbnails?: boolean; }
interface BrandingViewerState { images: { url: string }[]; label: string; initialIndex?: number; }

function PortfolioContent({ initialProjects }: { initialProjects: Project[] }) {
  const { t }        = useI18n();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initial      = (searchParams.get("category") as Category) || "covers";

  const [active,         setActive]         = useState<Category>(initial);
  const [sub,            setSub]            = useState<string | null>(searchParams.get("sub") || null);
  const [projects,       setProjects]       = useState<Project[]>(initialProjects);
  const [slideDir,       setSlideDir]       = useState<"left" | "right">("right");
  const [viewer,            setViewer]            = useState<ViewerState | null>(null);
  const [brandingViewer,    setBrandingViewer]    = useState<BrandingViewerState | null>(null);
  const [horizontalViewer,  setHorizontalViewer]  = useState<BrandingViewerState | null>(null);
  const [projectNav,        setProjectNav]        = useState<ProjectNavState | null>(null);

  const openViewer = useCallback((images: ViewerImage[], index: number) => setViewer({ images, index }), []);

  useEffect(() => {
    const cat    = searchParams.get("category") as Category;
    const subVal = searchParams.get("sub") || null;
    if (cat && CATEGORIES.includes(cat)) setActive(cat);
    setSub(subVal);
  }, [searchParams]);

  useEffect(() => {
    fetchProjects(active).then(setProjects);
  }, [active]);

  const switchCategory = (cat: Category) => {
    const oldIdx = CATEGORIES.indexOf(active);
    const newIdx = CATEGORIES.indexOf(cat);
    setSlideDir(newIdx >= oldIdx ? "right" : "left");
    setProjects([]);
    setActive(cat);
    setSub(null);
    router.replace(`/portfolio?category=${cat}`, { scroll: false });
  };

  const switchSub = (newSub: string | null) => {
    const order: (string | null)[] = [null, subtabs?.solo ?? null, subtabs?.grouped ?? null];
    const oldIdx = order.indexOf(sub);
    const newIdx = order.indexOf(newSub);
    setSlideDir(newIdx >= oldIdx ? "right" : "left");
    setSub(newSub);
    const url = newSub
      ? `/portfolio?category=${active}&sub=${newSub}`
      : `/portfolio?category=${active}`;
    router.replace(url, { scroll: false });
  };

  const subtabs = SUBTABS[active] ?? null;

  const SUB_TYPE_SOLO:    Partial<Record<Category, string>> = {
    covers: "single", branding: "logo", affiches: "affiche",
  };
  const SUB_TYPE_GROUPED: Partial<Record<Category, string>> = {
    covers: "album", branding: "branding", affiches: "pack",
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
          onOpen={openViewer}
          onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })}
          square
        />;
      }
      if (active === "miniatures") {
        return projects.length > 0
          ? <AllImagesGrid projects={projects} aspect={ASPECT.miniatures} onOpen={openViewer} onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet dans cette catégorie</p>;
      }
      if (active === "bannieres") {
        const bannerProjects = projects.filter(p => p.images[0]?.url);
        if (bannerProjects.length === 0) return (
          <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet dans cette catégorie</p>
        );
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP }}>
            {bannerProjects.map((p, i) => (
              <div
                key={p.id}
                className="relative overflow-hidden group cursor-pointer"
                style={{ backgroundColor: "#0c0c0c" }}
                onClick={() => setProjectNav({ projects: bannerProjects, projectIndex: i })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0].url} alt={p.title} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(133,92,157,0.15)" }} />
                <a href={`/portfolio/${p.id}`} className="sr-only">{p.title}</a>
              </div>
            ))}
          </div>
        );
      }
      if (active === "affiches") {
        return projects.length > 0
          ? <AllImagesGrid
              projects={projects}
              aspect={ASPECT.affiches}
              onOpen={openViewer}
              onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })}
              colsClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            />
          : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet dans cette catégorie</p>;
      }
      return projects.length > 0
        ? <AllImagesGrid
            projects={projects}
            aspect={ASPECT[active]}
            onOpen={openViewer}
            onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })}
            threeCol={threeCol}
            square={active === "covers"}
          />
        : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet dans cette catégorie</p>;
    }

    // ── solo sub-tab ─────────────────────────────────────
    if (sub === subtabs?.solo) {
      if (active === "branding") {
        return <BrandingGrid
          items={brandingLogoItems}
          cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          aspectRatio="1"
          onOpen={(_imgs, _lbl, idx) => setProjectNav({ projects: soloProjects, projectIndex: idx })}
        />;
      }
      if (active === "videos") return <VideoGrid projects={soloProjects} />;
      if (active === "affiches") {
        return soloProjects.length > 0
          ? <AllImagesGrid projects={soloProjects} aspect={ASPECT.affiches} onOpen={openViewer} onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })} colsClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
          : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet solo</p>;
      }
      return soloProjects.length > 0
        ? <CardGrid projects={soloProjects} aspectClass={ASPECT_CLASS[active]} aspect={ASPECT[active]} onOpen={openViewer} onOpenProject={(p, i, all) => setProjectNav({ projects: all, projectIndex: i })} />
        : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun projet solo</p>;
    }

    // ── grouped sub-tab ──────────────────────────────────
    if (sub === subtabs?.grouped) {
      if (active === "branding") {
        return <BrandingGrid items={brandingGroupItems} onOpen={(imgs, lbl, _idx) => setBrandingViewer({ images: imgs, label: lbl })} />;
      }
      if (active === "affiches") {
        return groupedProjects.length > 0
          ? <RowsView
              projects={groupedProjects}
              aspect={ASPECT.affiches}
              onOpen={(viewerImages, i) => setHorizontalViewer({
                images: viewerImages.map(img => ({ url: img.src || "" })),
                label: viewerImages[0]?.label || "",
                initialIndex: i,
              })}
            />
          : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun pack</p>;
      }
      if (active === "covers") {
        return groupedProjects.length > 0
          ? <RowsView
              projects={groupedProjects}
              aspect={ASPECT.covers}
              onOpen={(viewerImages, i) => setHorizontalViewer({
                images: viewerImages.map(img => ({ url: img.src || "" })),
                label: viewerImages[0]?.label || "",
                initialIndex: i,
              })}
            />
          : <p style={{ color: "rgba(245,243,247,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", textAlign: "center" }}>aucun album</p>;
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
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slide-in-right {
          from { transform: translateX(28px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-28px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

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
              <button onClick={() => switchSub(null)}            style={tabStyle(sub === null)}>tout</button>
              <button onClick={() => switchSub(subtabs.solo)}    style={tabStyle(sub === subtabs.solo)}>{subtabs.solo}</button>
              <button onClick={() => switchSub(subtabs.grouped)} style={tabStyle(sub === subtabs.grouped)}>{subtabs.grouped}</button>
            </div>
          )}

          {/* Content — slide transition on tab/sub change */}
          <div style={{ overflow: "hidden" }}>
            <div
              key={`${active}-${sub ?? "tout"}`}
              style={{
                display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3rem)",
                animation: `slide-in-${slideDir} 0.28s cubic-bezier(0.4,0,0.2,1)`,
              }}
            >
              {renderContent()}
            </div>
          </div>

          {/* Back */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="/#portfolio"
              style={{ padding: "0.6rem 1.5rem", fontSize: "clamp(0.72rem,0.95vw,1rem)", fontFamily: "Inter, sans-serif", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", color: "var(--white)", textTransform: "lowercase", textDecoration: "none", letterSpacing: "0.04em", transition: "all 0.3s", borderRadius: "0" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
            >
              {t("portfolio.back")}
            </a>
          </div>

        </div>
      </div>

      <Footer />

      {viewer && (
        <ImageViewer images={viewer.images} initialIndex={viewer.index} onClose={() => setViewer(null)} showThumbnails={viewer.showThumbnails} />
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
          initialIndex={horizontalViewer.initialIndex ?? 0}
          onClose={() => setHorizontalViewer(null)}
        />
      )}
      {projectNav && (
        <ProjectNavigator
          projects={projectNav.projects}
          projectIndex={projectNav.projectIndex}
          onClose={() => setProjectNav(null)}
        />
      )}
    </main>
  );
}

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  return <PortfolioContent initialProjects={initialProjects} />;
}
