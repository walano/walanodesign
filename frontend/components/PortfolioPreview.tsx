"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import ImageViewer, { ViewerImage } from "@/components/ImageViewer";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { key: "covers",     aspect: "aspect-square",  count: 5, cols: "grid-cols-5" },
  { key: "branding",   aspect: "aspect-square",  count: 5, cols: "grid-cols-5" },
  { key: "videos",     aspect: "aspect-video",   count: 3, cols: "grid-cols-3" },
  { key: "affiches",   aspect: "aspect-[3/4]",   count: 5, cols: "grid-cols-5" },
  { key: "miniatures", aspect: "aspect-video",   count: 3, cols: "grid-cols-3" },
  { key: "bannieres",  aspect: "aspect-video",   count: 3, cols: "grid-cols-3" },
] as const;

// Mobile: flat 2-col grid — all items same treatment, no special wide handling
const MOBILE_ITEMS: string[] = [
  "aspect-square",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-video",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-square",
  "aspect-video",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-square",
];

const CARD_GAP = "clamp(0.4rem, 0.8vw, 0.75rem)";

interface ViewerState { images: ViewerImage[]; index: number; }

export default function PortfolioPreview() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [viewer, setViewer] = useState<ViewerState | null>(null);

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
                    const rowImages: ViewerImage[] = Array.from({ length: count - 1 }).map((_, j) => ({
                      label:           `${t(`portfolio.categories.${key}`)} — ${j + 1}`,
                      aspectRatio:     aspect.replace("aspect-[", "").replace("]", "").replace("aspect-square", "1").replace("aspect-video", "16/9"),
                      backgroundColor: "#e8dff2",
                    }));
                    return (
                      <div
                        key={i}
                        className={`relative ${aspect} overflow-hidden cursor-pointer group/card`}
                        style={{ backgroundColor: "#e8dff2" }}
                        onClick={() => {
                          if (isLast) router.push(`/portfolio?category=${key}`);
                          else setViewer({ images: rowImages, index: i });
                        }}
                      >
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
                            <div className="absolute inset-0 z-[5] backdrop-blur-[2px]" />
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 700,
                                  fontSize: "0.6rem",
                                  color: "#0c0c0c",
                                  textTransform: "lowercase",
                                }}
                              >
                                {t("portfolio.voir_plus")}
                              </span>
                              <span style={{ color: "#855c9d", fontSize: "0.9rem" }}>→</span>
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

          {/* ── Mobile: flat 2-col grid, uniform treatment ── */}
          <div className="md:hidden flex flex-col" style={{ gap: CARD_GAP, paddingTop: "1.5rem" }}>
            {(() => {
              const mobileImages: ViewerImage[] = MOBILE_ITEMS.map((asp, i) => ({
                label:           `visuel ${i + 1}`,
                aspectRatio:     asp.replace("aspect-[", "").replace("]", "").replace("aspect-square", "1").replace("aspect-video", "16/9"),
                backgroundColor: "#e8dff2",
              }));
              const leftItems  = MOBILE_ITEMS.filter((_, i) => i % 2 === 0);
              const rightItems = MOBILE_ITEMS.filter((_, i) => i % 2 === 1);
              return (
                <div style={{ display: "flex", gap: CARD_GAP }}>
                  {/* Left column — even indices */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: CARD_GAP }}>
                    {leftItems.map((aspect, col) => {
                      const realIdx = col * 2;
                      return (
                        <div
                          key={col}
                          className={`relative ${aspect} overflow-hidden cursor-pointer`}
                          style={{ backgroundColor: "#e8dff2", width: "100%" }}
                          onClick={() => setViewer({ images: mobileImages, index: realIdx })}
                        />
                      );
                    })}
                  </div>
                  {/* Right column — odd indices */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: CARD_GAP }}>
                    {rightItems.map((aspect, col) => {
                      const realIdx = col * 2 + 1;
                      return (
                        <div
                          key={col}
                          className={`relative ${aspect} overflow-hidden cursor-pointer`}
                          style={{ backgroundColor: "#e8dff2", width: "100%" }}
                          onClick={() => setViewer({ images: mobileImages, index: realIdx })}
                        />
                      );
                    })}
                  </div>
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
    </section>
  );
}
