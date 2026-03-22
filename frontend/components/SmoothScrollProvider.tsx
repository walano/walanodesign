"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisRef } from "@/lib/lenis";
import { heroVel } from "@/lib/heroVelocity";

gsap.registerPlugin(ScrollTrigger);

const THRESHOLD = 80; // px to pull before triggering reload

interface Props {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: Props) {
  const [pullY, setPullY] = useState(0);   // 0..1 progress
  const [reloading, setReloading] = useState(false);
  const startYRef = useRef<number | null>(null);

  /* ── Pull-to-refresh ── */
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !heroVel.dragging) startYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (heroVel.dragging) { startYRef.current = null; return; }
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) setPullY(Math.min(delta / THRESHOLD, 1));
      else startYRef.current = null;
    };

    const onTouchEnd = () => {
      if (pullY >= 1) {
        setReloading(true);
        setTimeout(() => window.location.reload(), 300);
      }
      setPullY(0);
      startYRef.current = null;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove",  onTouchMove,  { passive: true });
    document.addEventListener("touchend",   onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove",  onTouchMove);
      document.removeEventListener("touchend",   onTouchEnd);
    };
  }, [pullY]);

  /* ── Lenis ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      overscroll: false,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 3400);

    return () => {
      clearTimeout(refreshTimer);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ── Indicator styles ── */
  const size   = 40 + pullY * 12;           // 40 → 52 px
  const opacity = reloading ? 1 : pullY;
  const translateY = reloading ? 16 : pullY * 16;
  const spin   = reloading ? "ptr-spin 0.8s linear infinite" : "none";

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <div
        aria-hidden
        style={{
          position:        "fixed",
          top:             0,
          left:            "50%",
          transform:       `translateX(-50%) translateY(${translateY}px)`,
          zIndex:          9999,
          pointerEvents:   "none",
          opacity,
          transition:      reloading ? "none" : "opacity 0.1s",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          style={{
            animation:     spin,
            filter:        "drop-shadow(0 0 6px rgba(133,92,157,0.5))",
            display:       "block",
          }}
        >
          <circle
            cx="20" cy="20" r="16"
            stroke="rgba(133,92,157,0.25)"
            strokeWidth="2"
          />
          <circle
            cx="20" cy="20" r="16"
            stroke="#855c9d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${pullY * 100} 100`}
            pathLength="100"
            transform="rotate(-90 20 20)"
          />
          {/* Arrow icon */}
          <path
            d="M20 13v9M20 22l-3.5-3.5M20 22l3.5-3.5"
            stroke="#855c9d"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform:       `rotate(${pullY * 180}deg)`,
              transformOrigin: "20px 20px",
              transition:      "transform 0.1s",
              opacity:         reloading ? 0 : 1,
            }}
          />
        </svg>
        <style>{`
          @keyframes ptr-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {children}
    </>
  );
}
