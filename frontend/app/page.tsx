"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import Nav from "@/components/Nav";
import Services from "@/components/Services";
import PortfolioPreview from "@/components/PortfolioPreview";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Hero           = dynamic(() => import("@/components/Hero"),           { ssr: false });
const StarBackground = dynamic(() => import("@/components/StarBackground"), { ssr: false });

function Preloader({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Logo fill animation is 1.8s — wait for it + small buffer then fade out
    const t1 = setTimeout(() => setFadeOut(true), 2400);
    const t2 = setTimeout(onDone, 3200); // 2400 + 800ms fade duration
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0c0c0c",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <svg
        viewBox="0 0 1065.69 850"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 110, height: 110, overflow: "visible" }}
      >
        <defs>
          <path
            id="logo-path-pre"
            d="M988.07,284.41c17.82-28.21,37.89-66.13,53.18-113.32,22.34-68.92,25.48-129.71,24.2-171.09-11.44,31.66-40.61,99.09-108.79,157.33-29.06,24.84-58.61,42.36-85.35,54.77-70.18-30.27-139.09-30.87-165.98-31.11-103.03-.89-180.58,37.06-217.11,58.11,21.82,13,56.31,37.11,86.63,77.53,14.04,18.72,67.24,91.89,57.37,188.35-4.09,39.88-22.83,121.72-67.16,129-35.8,5.88-69.71-39.89-75.7-47.97-54.87-74.07-25.12-177.58-11.71-215.01-19.79,26.69-55.4,44.49-96.03,44.49s-76.21-17.79-96.01-44.46c13.42,37.45,43.14,140.93-11.72,214.98-5.99,8.08-39.9,53.85-75.7,47.97-44.34-7.28-63.09-89.12-67.16-129-9.87-96.46,43.33-169.63,57.37-188.35,30.4-40.53,64.99-64.66,86.8-77.63-32.88-6.9-100.74-25.77-166.16-81.67C40.87,99.09,11.69,31.66.24,0c-1.28,41.39,1.86,102.18,24.2,171.09,15.3,47.19,35.37,85.11,53.18,113.32-19.92,29.59-62.93,102.22-64.91,203.52-1.45,74.23,19.76,131.86,34.11,163.28,6.9,11.38,22.9,41.32,19.49,80.88-1.84,21.27-8.65,37.93-14.12,48.54,15.8-2.21,56.01-5.65,99.5,15.56,33.97,16.58,54.04,40.43,63.43,53.33,29.2-20.35,79.54-61.2,118.45-129.75,32.01-56.42,43.5-109.05,48.03-142.71,4.54,33.65,16.03,86.29,48.04,142.71,38.9,68.56,89.25,109.41,118.44,129.75,9.39-12.9,29.46-36.75,63.43-53.33,4.33-2.11,8.62-3.97,12.86-5.62l46,59.43c15.03-25.86,40.29-59.54,77.23-65.34,36.97-5.8,57.16,20.8,95.24,24.17,64.53,5.7,119.79-60.71,137.88-82.45,86.66-104.15,105.25-305.74.78-432.46,2.19-3.17,4.37-6.34,6.56-9.51ZM895.44,645.36c-9.21,9.12-26.47,26.21-51.88,29.15-40,4.61-61.17-30.34-95.24-24.17-12.9,2.34-30.54,11.1-48.51,41.52,4.47-19.3,12.29-33.56,16.58-40.64,14.36-31.42,35.56-89.04,34.11-163.28-.98-50.07-11.98-93.13-25.26-127.46-13.08-33.8-31.34-65.35-53.75-93.82l-.65-.83c34.07-4.34,107.17-8.02,169.87,36.61,117.28,83.48,118.75,279.56,54.72,342.92Z"
          />
        </defs>
        {/* Ghost outline */}
        <use
          href="#logo-path-pre"
          style={{ fill: "rgba(245,243,247,0.08)", stroke: "rgba(245,243,247,0.2)", strokeWidth: 2 }}
        />
        {/* Animated fill — bottom to top */}
        <use
          href="#logo-path-pre"
          style={{
            fill: "#855c9d",
            filter: "drop-shadow(0 0 12px rgba(133,92,157,0.7))",
            animation: "preloaderFill 1.8s ease-in-out forwards",
          }}
        />
        <style>{`
          @keyframes preloaderFill {
            0%   { clip-path: inset(100% 0 0 0); }
            100% { clip-path: inset(0% 0 0 0); }
          }
        `}</style>
      </svg>
    </div>
  );
}

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const onDone = useCallback(() => setPreloaderDone(true), []);

  return (
    <>
      <Preloader onDone={onDone} />

      <main>
        <StarBackground />
        <Nav />
        <Hero />
        <Services />
        <PortfolioPreview />
        <About />
        <Footer />
      </main>
    </>
  );
}
