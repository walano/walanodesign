"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageViewer, { ViewerImage } from "@/components/ImageViewer";

type Category = "covers" | "branding" | "videos" | "affiches" | "miniatures" | "bannieres";

const CATEGORIES: Category[] = ["covers", "branding", "videos", "affiches", "miniatures", "bannieres"];

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

const COUNTS: Record<Category, number> = {
  covers: 12, branding: 8, videos: 6, affiches: 10, miniatures: 9, bannieres: 6,
};

// "grid" = flat grid, "rows" = one draggable row per group
interface SubGrid { name: string; mode: "grid"; count: number; }
interface SubRows { name: string; mode: "rows"; groups: { label: string; count: number }[]; }
type SubDef = SubGrid | SubRows;

const SUBDIVISIONS: Partial<Record<Category, SubDef[]>> = {
  covers: [
    { name: "singles", mode: "grid", count: 8 },
    { name: "albums",  mode: "rows", groups: [
      { label: "album 1", count: 4 },
      { label: "album 2", count: 3 },
      { label: "album 3", count: 5 },
    ]},
  ],
  branding: [
    { name: "logo",     mode: "grid", count: 4 },
    { name: "branding", mode: "rows", groups: [
      { label: "identité 1", count: 4 },
      { label: "identité 2", count: 3 },
    ]},
  ],
  affiches: [
    { name: "uniques",    mode: "grid", count: 6 },
    { name: "événements", mode: "rows", groups: [
      { label: "événement 1", count: 3 },
      { label: "événement 2", count: 4 },
    ]},
  ],
  miniatures: [
    { name: "simples", mode: "grid", count: 6 },
    { name: "packs",   mode: "rows", groups: [
      { label: "pack 1", count: 4 },
      { label: "pack 2", count: 3 },
    ]},
  ],
};

const CARD_GAP = "clamp(0.4rem, 0.8vw, 0.75rem)";
const ROW_HEIGHT = "clamp(160px, 18vw, 260px)";

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
  letterSpacing: "0.04em",
  padding: "0.6rem 1.4rem",
  textTransform: "lowercase",
  transition: "all 0.3s",
  cursor: "pointer",
  border: "none",
  color: "#f5f3f7",
  ...(active
    ? {
        backgroundColor: "rgba(133, 92, 157, 0.3)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        outline: "1px solid rgba(133, 92, 157, 0.5)",
      }
    : {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        outline: "1px solid rgba(255, 255, 255, 0.18)",
      }),
});

// Draggable horizontal row
function DragRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - ref.current.getBoundingClientRect().left;
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
      style={{
        display: "flex",
        gap: CARD_GAP,
        overflowX: "auto",
        scrollbarWidth: "none",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}

// Flat grid of placeholder cards
function CardGrid({ count, aspect, aspectClass, label, onOpen }: {
  count: number; aspect: string; aspectClass: string; label: string;
  onOpen: (images: ViewerImage[], index: number) => void;
}) {
  const cols =
    aspectClass === "aspect-square" || aspectClass === "aspect-[3/4]"
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const images: ViewerImage[] = Array.from({ length: count }).map((_, i) => ({
    label:           `${label} — ${i + 1}`,
    aspectRatio:     aspect,
    backgroundColor: "#e8dff2",
  }));

  return (
    <div className={`grid ${cols}`} style={{ gap: CARD_GAP }}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative ${aspectClass} overflow-hidden group cursor-pointer`}
          style={{ backgroundColor: "#e8dff2" }}
          onClick={() => onOpen(images, i)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
              {label}
            </span>
          </div>
          <div
            className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(133,92,157,0.2)" }}
          >
            <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
              projet {i + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Rows mode: one draggable row per group, label below
function RowsView({ groups, aspect, aspectClass, onOpen }: {
  groups: { label: string; count: number }[];
  aspect: string;
  aspectClass: string;
  onOpen: (images: ViewerImage[], index: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
      {groups.map(({ label, count }) => {
        const rowImages: ViewerImage[] = Array.from({ length: count }).map((_, i) => ({
          label:           `${label} — ${i + 1}`,
          aspectRatio:     aspect,
          backgroundColor: "#e8dff2",
        }));
        return (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <DragRow>
              {rowImages.map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden flex-shrink-0 group cursor-pointer"
                  style={{
                    backgroundColor: "#e8dff2",
                    height: ROW_HEIGHT,
                    aspectRatio: aspect,
                  }}
                  onClick={() => onOpen(rowImages, i)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#855c9d]/30 text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                      {label}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "rgba(133,92,157,0.2)" }}
                  >
                    <span className="text-[#f5f3f7] text-xs tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                      {img.label}
                    </span>
                  </div>
                </div>
              ))}
            </DragRow>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
                letterSpacing: "0.06em",
                color: "#f5f3f7",
                textTransform: "lowercase",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface ViewerState { images: ViewerImage[]; index: number; }

function PortfolioContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = (searchParams.get("category") as Category) || "covers";
  const [active, setActive] = useState<Category>(initial);
  const [sub, setSub] = useState<string | null>(null);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const openViewer = useCallback((images: ViewerImage[], index: number) => setViewer({ images, index }), []);

  useEffect(() => {
    const cat = searchParams.get("category") as Category;
    if (cat && CATEGORIES.includes(cat)) {
      setActive(cat);
      setSub(null);
    }
  }, [searchParams]);

  const switchCategory = (cat: Category) => {
    setActive(cat);
    setSub(null);
    router.replace(`/portfolio?category=${cat}`, { scroll: false });
  };

  const subs = SUBDIVISIONS[active];
  const activeSub = subs?.find((s) => s.name === sub) ?? null;

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Nav />

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(clamp(1rem, 2vw, 2.5rem), 1fr) minmax(0, 100rem) minmax(clamp(1rem, 2vw, 2.5rem), 1fr)",
          paddingTop: "7rem",
          paddingBottom: "6rem",
        }}
      >
        <div style={{ gridColumn: 2, display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>

          {/* Title */}
          <h1
            style={{
              fontFamily: "austin-pen, cursive",
              fontSize: "clamp(2.8rem, 9vw, 7rem)",
              color: "#f5f3f7",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {t("portfolio.title")}
          </h1>

          {/* Category tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", borderBottom: "1px solid rgba(133,92,157,0.15)", paddingBottom: "1.5rem" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => switchCategory(cat)} style={tabStyle(active === cat)}>
                {t(`portfolio.categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Sub-tabs — only for subdivided categories */}
          {subs && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button onClick={() => setSub(null)} style={tabStyle(sub === null)}>
                tout
              </button>
              {subs.map((s) => (
                <button key={s.name} onClick={() => setSub(s.name)} style={tabStyle(sub === s.name)}>
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {activeSub?.mode === "rows" ? (
            // Pack/album view — one draggable row per group
            <RowsView
              groups={activeSub.groups}
              aspect={ASPECT[active]}
              aspectClass={ASPECT_CLASS[active]}
              onOpen={openViewer}
            />
          ) : (
            // Flat grid — "tout", "singles", "uniques", "simples", "logo"
            <CardGrid
              count={activeSub?.mode === "grid" ? activeSub.count : COUNTS[active]}
              aspect={ASPECT[active]}
              aspectClass={ASPECT_CLASS[active]}
              label={sub ?? t(`portfolio.categories.${active}`)}
              onOpen={openViewer}
            />
          )}

          {/* Back link */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="/#portfolio"
              style={{
                padding: "0.6rem 1.5rem",
                fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "var(--white)",
                textTransform: "lowercase",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "all 0.3s",
                borderRadius: "0",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.18)";
              }}
            >
              ← retour
            </a>
          </div>

        </div>
      </div>

      <Footer />

      {viewer && (
        <ImageViewer
          images={viewer.images}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </main>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense>
      <PortfolioContent />
    </Suspense>
  );
}
