"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

function LogoSVG({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1980.26 1579.46"
      width={size}
      height={size * (1579.46 / 1980.26)}
      style={{ display: "block" }}
    >
      <path
        fill="#855c9d"
        d="M1836.02,528.49c33.12-52.41,70.4-122.88,98.82-210.57,41.51-128.06,47.34-241.02,44.96-317.92-21.26,58.84-75.47,184.12-202.15,292.36-54,46.15-108.91,78.71-158.61,101.77-130.4-56.25-258.46-57.36-308.43-57.8-191.45-1.66-335.55,68.86-403.44,107.98,40.55,24.16,104.64,68.95,160.97,144.07,26.1,34.79,124.95,170.75,106.61,349.99-7.59,74.1-42.42,226.17-124.8,239.7-66.52,10.93-129.54-74.12-140.66-89.14-101.97-137.64-46.67-329.98-21.75-399.53-36.78,49.59-102.94,82.67-178.44,82.67s-141.61-33.05-178.4-82.62c24.93,69.6,80.16,261.88-21.78,399.48-11.12,15.01-74.14,100.06-140.66,89.14-82.39-13.53-117.22-165.6-124.8-239.7-18.34-179.24,80.51-315.21,106.6-349.99,56.48-75.31,120.76-120.15,161.3-144.25-61.09-12.83-187.2-47.89-308.75-151.77C75.94,184.12,21.71,58.84.45,0-1.92,76.9,3.91,189.86,45.42,317.92c28.44,87.69,65.72,158.15,98.82,210.57-37.02,54.99-116.94,189.94-120.61,378.18-2.7,137.94,36.71,245.01,63.39,303.4,12.82,21.14,42.56,76.77,36.22,150.29-3.41,39.53-16.07,70.49-26.24,90.2,29.35-4.1,104.07-10.5,184.9,28.92,63.12,30.8,100.41,75.13,117.86,99.09,54.26-37.81,147.81-113.72,220.1-241.11,59.49-104.84,80.82-202.64,89.25-265.18,8.44,62.54,29.78,160.34,89.27,265.18,72.29,127.39,165.84,203.3,220.08,241.11,17.46-23.96,54.74-68.29,117.87-99.09,8.04-3.92,16.02-7.38,23.9-10.45l85.48,110.44c27.93-48.05,74.87-110.64,143.5-121.41,68.69-10.79,106.22,38.65,176.97,44.91,119.91,10.59,222.59-112.8,256.21-153.2,161.04-193.53,195.58-568.12,1.45-803.59,4.06-5.9,8.12-11.78,12.18-17.68ZM1663.9,1199.2c-17.12,16.95-49.19,48.7-96.4,54.16-74.33,8.57-113.67-56.38-176.97-44.91-23.98,4.34-56.76,20.63-90.13,77.15,8.31-35.86,22.84-62.37,30.82-75.52,26.68-58.39,66.08-165.46,63.39-303.4-1.82-93.04-22.26-173.06-46.94-236.84-24.3-62.8-58.23-121.43-99.88-174.34l-1.21-1.54c63.3-8.07,199.15-14.91,315.65,68.02,217.92,155.13,220.66,519.47,101.68,637.22Z"
      />
    </svg>
  );
}

export default function NotFound() {
  const { t } = useI18n();
  const logoRef  = useRef<HTMLDivElement>(null);
  const jiggling = useRef(false);

  const handleJiggle = () => {
    if (jiggling.current || !logoRef.current) return;
    jiggling.current = true;
    gsap.to(logoRef.current, {
      rotation: 18,
      duration: 0.07,
      yoyo:     true,
      repeat:   7,
      ease:     "power2.inOut",
      onComplete: () => {
        gsap.set(logoRef.current!, { rotation: 0 });
        jiggling.current = false;
      },
    });
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Nav />

      <style>{`
        .nf-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(2.5rem, 5vw, 4rem);
          padding: clamp(5rem, 10vw, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem);
        }
        @media (min-width: 768px) {
          .nf-layout {
            flex-direction: row;
            align-items: center;
            gap: clamp(4rem, 7vw, 7rem);
          }
        }
        .nf-logo {
          flex-shrink: 0;
          cursor: pointer;
          user-select: none;
          transition: filter 0.3s;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          background: transparent;
        }
        .nf-logo:hover { filter: drop-shadow(0 0 18px rgba(133,92,157,0.5)); }

      `}</style>

      <div className="nf-layout">

        {/* ── Logo ── */}
        <div ref={logoRef} className="nf-logo" onClick={handleJiggle}>
          <LogoSVG size={220} />
        </div>

        {/* ── Text ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    700,
            fontSize:      "clamp(0.68rem, 0.85vw, 0.78rem)",
            letterSpacing: "0.12em",
            color:         "rgba(133,92,157,0.8)",
            margin:        0,
          }}>
            {t("notfound.code")}
          </p>

          <h1 style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    300,
            fontSize:      "clamp(1.8rem, 4vw, 3.5rem)",
            color:         "#f5f3f7",
            lineHeight:    1.1,
            letterSpacing: "-0.03em",
            margin:        0,
          }}>
            {t("notfound.title")}
          </h1>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "clamp(0.8rem, 1vw, 0.9rem)",
            color:      "rgba(245,243,247,0.35)",
            lineHeight: 1.7,
            margin:     0,
            maxWidth:   360,
          }}>
            {t("notfound.sub")}
          </p>

          <a
            href="/"
            style={{
              marginTop:            "0.5rem",
              alignSelf:            "flex-start",
              fontFamily:           "Inter, sans-serif",
              fontWeight:           600,
              fontSize:             "clamp(0.72rem, 0.95vw, 0.85rem)",
              letterSpacing:        "0.04em",
              padding:              "0.7rem 1.6rem",
              background:           "rgba(133,92,157,0.3)",
              backdropFilter:       "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              outline:              "1px solid rgba(133,92,157,0.5)",
              border:               "none",
              color:                "#f5f3f7",
              textDecoration:       "none",
              transition:           "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background     = "rgba(133,92,157,0.5)";
              e.currentTarget.style.outlineColor   = "rgba(133,92,157,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background     = "rgba(133,92,157,0.3)";
              e.currentTarget.style.outlineColor   = "rgba(133,92,157,0.5)";
            }}
          >
            {t("notfound.home")}
          </a>


        </div>

      </div>

      <Footer />
    </main>
  );
}
