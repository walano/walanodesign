"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { scrollTo } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { key: "covers",     col: 1, row: 1 },
  { key: "branding",   col: 2, row: 1, center: true },
  { key: "videos",     col: 3, row: 1 },
  { key: "affiches",   col: 1, row: 2 },
  { key: "miniatures", col: 2, row: 2, center: true },
  { key: "bannieres",  col: 3, row: 2 },
] satisfies { key: string; col: number; row: number; center?: true }[];

export default function Services() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-item", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 20,
        stagger: { amount: 0.4, from: "start" },
        duration: 0.9, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ position: "relative", paddingBlock: "clamp(4rem, 8vw, 8rem)" }}
    >
      {/*
        ── Centering grid ────────────────────────────────────────────────────
        Left margin col | content col (max 72rem) | right margin col
        The margin columns grow to fill space but never shrink below the clamp min.
        This guarantees consistent edge padding at all viewport sizes.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(clamp(1.5rem, 5vw, 6rem), 1fr) minmax(0, 72rem) minmax(clamp(1.5rem, 5vw, 6rem), 1fr)",
        }}
      >
        {/* All content lives in column 2 */}
        <div style={{ gridColumn: 2 }}>

          {/* ── Title (centered by text-align) ── */}
          <h2
            style={{
              fontFamily: "austin-pen, cursive",
              fontSize: "clamp(2.8rem, 9vw, 7rem)",
              color: "var(--white)",
              textAlign: "center",
              lineHeight: 1,
              marginBottom: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            {t("services.title")}
          </h2>

          {/* ── Mobile: single column stack ── */}
          <div
            className="grid md:hidden"
            style={{ gap: "2rem" }}
          >
            {SERVICES.map(({ key }) => (
              <div key={key} className="svc-item" style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.4rem, 5vw, 2rem)",
                    color: "var(--white)",
                    lineHeight: 1.1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {t(`services.${key}.label`)}
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
                    color: "var(--white)",
                  }}
                >
                  {t(`services.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* ── Desktop: 3 × 2 grid ── */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "auto auto",
              columnGap: "clamp(2rem, 5vw, 5rem)",
              rowGap: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            {SERVICES.map(({ key, col, row }) => (
              <div
                key={key}
                className="svc-item"
                style={{ gridColumn: col, gridRow: row, textAlign: "center", cursor: "pointer" }}
                onClick={() => scrollTo(`#portfolio-${key}`)}
              >
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize:   "clamp(1.1rem, 2vw, 2rem)",
                    color:      "var(--white)",
                    lineHeight: 1.1,
                    marginBottom: "0.3rem",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#855c9d")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white)")}
                >
                  {t(`services.${key}.label`)}
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
                    color: "var(--white)",
                  }}
                >
                  {t(`services.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
