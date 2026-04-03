"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { scrollTo } from "@/lib/lenis";
import { heroVel } from "@/lib/heroVelocity";

const THRESHOLD  = 160;
const MIN_SPEED  = 0.4;
const NAV_H      = 56;
const NAV_H_FULL = 108;
const RING_R     = 26;
const RING_SIZE  = RING_R * 2 + 8; // 60

// Lerp between white (#fff) and violet (#855c9d)
function lerpColor(p: number): string {
  const r = Math.round(255 - 122 * p);
  const g = Math.round(255 - 163 * p);
  const b = Math.round(255 - 98  * p);
  return `rgb(${r},${g},${b})`;
}

// Inline logo path (logo.svg — single path, fill driven by prop)
function LogoMark({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1980.26 1579.46"
      width={28}
      height={22}
      style={{ display: "block" }}
    >
      <path
        fill={fill}
        d="M1836.02,528.49c33.12-52.41,70.4-122.88,98.82-210.57,41.51-128.06,47.34-241.02,44.96-317.92-21.26,58.84-75.47,184.12-202.15,292.36-54,46.15-108.91,78.71-158.61,101.77-130.4-56.25-258.46-57.36-308.43-57.8-191.45-1.66-335.55,68.86-403.44,107.98,40.55,24.16,104.64,68.95,160.97,144.07,26.1,34.79,124.95,170.75,106.61,349.99-7.59,74.1-42.42,226.17-124.8,239.7-66.52,10.93-129.54-74.12-140.66-89.14-101.97-137.64-46.67-329.98-21.75-399.53-36.78,49.59-102.94,82.67-178.44,82.67s-141.61-33.05-178.4-82.62c24.93,69.6,80.16,261.88-21.78,399.48-11.12,15.01-74.14,100.06-140.66,89.14-82.39-13.53-117.22-165.6-124.8-239.7-18.34-179.24,80.51-315.21,106.6-349.99,56.48-75.31,120.76-120.15,161.3-144.25-61.09-12.83-187.2-47.89-308.75-151.77C75.94,184.12,21.71,58.84.45,0-1.92,76.9,3.91,189.86,45.42,317.92c28.44,87.69,65.72,158.15,98.82,210.57-37.02,54.99-116.94,189.94-120.61,378.18-2.7,137.94,36.71,245.01,63.39,303.4,12.82,21.14,42.56,76.77,36.22,150.29-3.41,39.53-16.07,70.49-26.24,90.2,29.35-4.1,104.07-10.5,184.9,28.92,63.12,30.8,100.41,75.13,117.86,99.09,54.26-37.81,147.81-113.72,220.1-241.11,59.49-104.84,80.82-202.64,89.25-265.18,8.44,62.54,29.78,160.34,89.27,265.18,72.29,127.39,165.84,203.3,220.08,241.11,17.46-23.96,54.74-68.29,117.87-99.09,8.04-3.92,16.02-7.38,23.9-10.45l85.48,110.44c27.93-48.05,74.87-110.64,143.5-121.41,68.69-10.79,106.22,38.65,176.97,44.91,119.91,10.59,222.59-112.8,256.21-153.2,161.04-193.53,195.58-568.12,1.45-803.59,4.06-5.9,8.12-11.78,12.18-17.68ZM1663.9,1199.2c-17.12,16.95-49.19,48.7-96.4,54.16-74.33,8.57-113.67-56.38-176.97-44.91-23.98,4.34-56.76,20.63-90.13,77.15,8.31-35.86,22.84-62.37,30.82-75.52,26.68-58.39,66.08-165.46,63.39-303.4-1.82-93.04-22.26-173.06-46.94-236.84-24.3-62.8-58.23-121.43-99.88-174.34l-1.21-1.54c63.3-8.07,199.15-14.91,315.65,68.02,217.92,155.13,220.66,519.47,101.68,637.22Z"
      />
    </svg>
  );
}

export default function Nav() {
  const [visible,   setVisible]   = useState(true);
  const [pullY,     setPullY]     = useState(0);
  const [reloading, setReloading] = useState(false);

  const lastY        = useRef(0);
  const startYRef    = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pullYRef     = useRef(0);

  const pathname = usePathname();
  const isHome   = pathname === "/";

  /* ── Nav hide/show on scroll ── */
  useEffect(() => {
    if (isHome) setVisible(false);

    const onScroll = () => {
      const y = window.scrollY;
      if (isHome && y < 60)      setVisible(false);
      else if (y > lastY.current) setVisible(false);
      else                        setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* ── Pull-to-refresh ── */
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !heroVel.dragging && !document.body.dataset.viewerOpen) {
        startYRef.current    = e.touches[0].clientY;
        startTimeRef.current = Date.now();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (heroVel.dragging) { startYRef.current = null; return; }
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        const v = Math.min(delta / THRESHOLD, 1);
        setPullY(v);
        pullYRef.current = v;
      } else {
        startYRef.current = null;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (
        pullYRef.current >= 1 &&
        startYRef.current    !== null &&
        startTimeRef.current !== null
      ) {
        const elapsed = Date.now() - startTimeRef.current;
        const pulled  = (e.changedTouches[0]?.clientY ?? 0) - startYRef.current;
        const speed   = elapsed > 0 ? pulled / elapsed : 0;
        if (speed >= MIN_SPEED) {
          setReloading(true);
          setTimeout(() => window.location.reload(), 500);
        }
      }
      setPullY(0);
      pullYRef.current     = 0;
      startYRef.current    = null;
      startTimeRef.current = null;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove",  onTouchMove,  { passive: true });
    document.addEventListener("touchend",   onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove",  onTouchMove);
      document.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  /* ── Derived visual values ── */
  const isPulling  = pullY > 0 || reloading;
  const p          = reloading ? 1 : pullY;

  const headerH    = NAV_H + p * (NAV_H_FULL - NAV_H);
  const logoShift  = p * 20;
  const ringDash   = p * 100;
  const ringOpacity = reloading ? 1 : p;
  const spinAnim   = reloading ? "ptr-spin 0.9s linear infinite" : "none";
  const logoFill   = lerpColor(p);

  const translateY = isPulling ? 0 : visible ? 0 : -100;

  return (
    <>
      <style>{`@keyframes ptr-spin { to { transform: rotate(360deg); } }`}</style>

      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height:               `${headerH}px`,
          backgroundColor:      "rgba(12,12,12,0.92)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom:         isPulling
            ? `1px solid rgba(133,92,157,${p * 0.45})`
            : "1px solid rgba(255,255,255,0.06)",
          transform:            `translateY(${translateY}%)`,
          transition:           isPulling
            ? "none"
            : "transform 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s ease, border-color 0.35s ease",
          display:              "flex",
          alignItems:           "flex-start",
          justifyContent:       "center",
          overflow:             "hidden",
        }}
      >
        {/* Logo + ring */}
        <div
          style={{
            position:       "relative",
            marginTop:      `${(NAV_H - RING_SIZE) / 2 + logoShift}px`,
            width:          `${RING_SIZE}px`,
            height:         `${RING_SIZE}px`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            transition:     isPulling ? "none" : "margin-top 0.35s ease",
          }}
        >
          {/* Progress ring */}
          <svg
            aria-hidden
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            fill="none"
            style={{
              position:   "absolute",
              inset:      0,
              opacity:    ringOpacity,
              animation:  spinAnim,
              transition: "opacity 0.15s",
            }}
          >
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
              stroke="rgba(133,92,157,0.2)" strokeWidth="1.5"
            />
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
              stroke="#855c9d" strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${ringDash} 100`}
              pathLength="100"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </svg>

          {/* Logo with color morph */}
          <a
            href={isHome ? "#hero" : "/"}
            style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}
            onClick={(e) => {
              if (isHome && !isPulling) { e.preventDefault(); scrollTo("#hero"); }
            }}
          >
            <LogoMark fill={logoFill} />
          </a>
        </div>
      </header>
    </>
  );
}
