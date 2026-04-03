"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import ImageViewer, { ViewerImage } from "@/components/ImageViewer";
import { fetchPreviewSlots, Project } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { key: "covers",     aspect: "aspect-square",  count: 5, cols: "grid-cols-5" },
  { key: "branding",   aspect: "aspect-square",  count: 5, cols: "grid-cols-5" },
  { key: "videos",     aspect: "aspect-video",   count: 3, cols: "grid-cols-3" },
  { key: "affiches",   aspect: "aspect-[3/4]",   count: 5, cols: "grid-cols-5" },
  { key: "miniatures", aspect: "aspect-video",   count: 3, cols: "grid-cols-3" },
  { key: "bannieres",  aspect: "aspect-[16/3]",  count: 2, cols: "grid-cols-1" },
] as const;

// Mobile layout: 4 squares | 1 wide | 2 tall | 1 wide  (8 slots total)
// slot index →  aspect
const MOBILE_LAYOUT = [
  "aspect-square",  // 0
  "aspect-square",  // 1
  "aspect-square",  // 2
  "aspect-square",  // 3
  "aspect-video",   // 4 — full width
  "aspect-[3/4]",   // 5
  "aspect-[3/4]",   // 6
  "aspect-video",   // 7 — full width
] as const;

const CARD_GAP = "clamp(0.4rem, 0.8vw, 0.75rem)";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

interface ViewerState { images: ViewerImage[]; index: number; }

export default function PortfolioPreview() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [viewer,   setViewer]   = useState<ViewerState | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [desktopProjects, setDesktopProjects] = useState<Project[]>([]);
  const [mobileProjects,  setMobileProjects]  = useState<Project[]>([]);

  useEffect(() => {
    fetchPreviewSlots("desktop").then(slots => setDesktopProjects(slots.map(s => s.project)));
    fetchPreviewSlots("mobile").then(slots  => setMobileProjects(slots.map(s => s.project)));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".portfolio-title", {
        scrollTrigger: { trigger: ".portfolio-title", start: "top 85%" },
        y: 30, duration: 1, ease: "power3.out",
      });
      document.querySelectorAll(".portfolio-row").forEach((row) => {
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: "top 92%" },
          y: 20, duration: 0.8, ease: "power3.out",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{ paddingBlock: "clamp(4rem, 8vw, 8rem)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(clamp(1rem, 2vw, 2.5rem), 1fr) minmax(0, 100rem) minmax(clamp(1rem, 2vw, 2.5rem), 1fr)",
        }}
      >
        <div style={{ gridColumn: 2, display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3.5rem)" }}>

          {/* ── Title ── */}
          <h2
            className="portfolio-title"
            style={{
              fontFamily: "austin-pen, cursive",
              fontSize: "clamp(2.8rem, 9vw, 7rem)",
              color: "#f5f3f7",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {t("portfolio.title")}
          </h2>

          {/* ── Desktop: category rows, gap = card gap ── */}
          <div className="hidden md:flex flex-col" style={{ gap: CARD_GAP }}>
            {CATEGORIES.map(({ key, aspect, count, cols }) => (
              <div
                key={key}
                id={`portfolio-${key}`}
                className="portfolio-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "clamp(60px, 8vw, 100px) 1fr",
                  gap: "clamp(1rem, 2vw, 2rem)",
                  alignItems: "center",
                }}
              >
                {/* Label */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1.1rem, 2vw, 2rem)",
                      color: "var(--white)",
                      textAlign: "right",
                      lineHeight: 1.3,
                      textTransform: "lowercase",
                    }}
                  >
                    {t(`portfolio.categories.${key}`)}
                  </span>
                </div>

                {/* Cards */}
                <div className={`grid ${cols}`} style={{ gap: CARD_GAP }}>
                  {Array.from({ length: count }).map((_, i) => {
                    const isLast = i === count - 1;
                    const catProjects = desktopProjects.filter(p =>
                      (p.images.length > 0 || p.yt_thumbnail) && p.category === key);
                    const proj = catProjects[i];
                    const imgUrl = proj?.images[0]?.url || proj?.yt_thumbnail;
                    const rowImages: ViewerImage[] = catProjects.slice(0, count - 1).map(p => ({
                      src:             p.images[0]?.url || p.yt_thumbnail || "",
                      label:           p.title || t(`portfolio.categories.${key}`),
                      aspectRatio:     aspect.replace("aspect-[", "").replace("]", "").replace("aspect-square", "1").replace("aspect-video", "16/9"),
                      backgroundColor: "#0c0c0c",
                    }));
                    return (
                      <div
                        key={i}
                        className={`relative ${aspect} overflow-hidden cursor-pointer group/card`}
                        style={{ backgroundColor: "#0c0c0c" }}
                        onClick={() => {
                          if (isLast) { router.push(`/portfolio?category=${key}`); return; }
                          if (proj?.youtube_url) {
                            const id = getYouTubeId(proj.youtube_url);
                            if (id) { setVideoUrl(`https://www.youtube.com/embed/${id}?autoplay=1`); return; }
                          }
                          setViewer({ images: rowImages, index: i });
                        }}
                      >
                        {imgUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt={proj?.title || ""} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        {/* Play button overlay for video projects */}
                        {proj?.youtube_url && !isLast && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: "rgba(12,12,12,0.7)", border: "1px solid rgba(255,255,255,0.3)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <svg viewBox="0 0 12 12" width="12" height="12" fill="#f5f3f7">
                                <polygon points="3,1 11,6 3,11" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div
                          className="absolute inset-0 transition-all duration-300"
                          style={{ backgroundColor: "rgba(133,92,157,0)" }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(133,92,157,0.2)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(133,92,157,0)")
                          }
                        />
                        {isLast && (
                          <>
                            <div className="absolute inset-0 z-[5] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" style={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(12,12,12,0.45)" }} />
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 700,
                                  fontSize: "0.6rem",
                                  color: "#f5f3f7",
                                  textTransform: "lowercase",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                {t("portfolio.voir_plus")}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: voir plus button ── */}
          <div className="hidden md:flex justify-center">
            <a
              href="/portfolio"
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
              {t("portfolio.voir_plus")}
            </a>
          </div>

          {/* ── Mobile: structured layout ── */}
          <div className="md:hidden flex flex-col" style={{ gap: CARD_GAP, paddingTop: "1.5rem" }}>
            {(() => {
              const images = mobileProjects.map(p => ({
                src:             p.images[0]?.url || p.yt_thumbnail || undefined,
                label:           p.title || "",
                aspectRatio:     "1",
                backgroundColor: "#0c0c0c",
              }));
              // pad to 8 slots
              const slots = MOBILE_LAYOUT.map((aspect, i) => ({
                ...(images[i] ?? { src: undefined, label: `visuel ${i + 1}`, aspectRatio: "1", backgroundColor: "#0c0c0c" }),
                aspect,
              }));

              const card = (idx: number, extraStyle?: React.CSSProperties) => {
                const proj = mobileProjects[idx];
                const handleClick = () => {
                  if (proj?.youtube_url) {
                    const id = getYouTubeId(proj.youtube_url);
                    if (id) { setVideoUrl(`https://www.youtube.com/embed/${id}?autoplay=1`); return; }
                  }
                  setViewer({ images: images.slice(0, 8), index: idx });
                };
                return (
                  <div
                    key={idx}
                    className={`relative ${slots[idx].aspect} overflow-hidden cursor-pointer`}
                    style={{ backgroundColor: "#0c0c0c", ...extraStyle }}
                    onClick={handleClick}
                  >
                    {slots[idx].src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slots[idx].src} alt={proj?.title || ""} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {proj?.youtube_url && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(12,12,12,0.15)" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "rgba(12,12,12,0.65)", border: "1px solid rgba(255,255,255,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg viewBox="0 0 12 12" width="11" height="11" fill="#f5f3f7">
                            <polygon points="3,1 11,6 3,11" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP }}>
                  {/* row 1: squares 0 + 1 */}
                  <div style={{ display: "flex", gap: CARD_GAP }}>
                    <div style={{ flex: 1 }}>{card(0)}</div>
                    <div style={{ flex: 1 }}>{card(1)}</div>
                  </div>
                  {/* row 2: squares 2 + 3 */}
                  <div style={{ display: "flex", gap: CARD_GAP }}>
                    <div style={{ flex: 1 }}>{card(2)}</div>
                    <div style={{ flex: 1 }}>{card(3)}</div>
                  </div>
                  {/* row 3: full-width horizontal 4 */}
                  {card(4, { width: "100%" })}
                  {/* row 4: tall 5 + 6 */}
                  <div style={{ display: "flex", gap: CARD_GAP }}>
                    <div style={{ flex: 1 }}>{card(5)}</div>
                    <div style={{ flex: 1 }}>{card(6)}</div>
                  </div>
                  {/* row 5: full-width horizontal 7 */}
                  {card(7, { width: "100%" })}
                </div>
              );
            })()}

            {/* Voir plus — glass button same as "obtenir un devis gratuit" */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5rem" }}>
              <a
                href="/portfolio"
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
                {t("portfolio.voir_plus")}
              </a>
            </div>
          </div>

        </div>
      </div>

      {viewer && (
        <ImageViewer
          images={viewer.images}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}

      {videoUrl && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setVideoUrl(null)}
        >
          <div
            style={{ position: "relative", width: "min(90vw, 900px)", aspectRatio: "16/9" }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={videoUrl}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
            <button
              onClick={() => setVideoUrl(null)}
              style={{
                position: "absolute", top: "-2.2rem", right: 0,
                background: "none", border: "none",
                color: "rgba(245,243,247,0.6)", fontFamily: "Inter, sans-serif",
                fontSize: "0.8rem", letterSpacing: "0.06em", cursor: "pointer",
              }}
            >
              fermer
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
