"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { scrollTo } from "@/lib/lenis";

export default function Nav() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    // On home, start hidden (hero title is visible at top)
    if (isHome) setVisible(false);

    const onScroll = () => {
      const y = window.scrollY;
      if (isHome && y < 60) {
        setVisible(false);          // home top → always hide
      } else if (y > lastY.current) {
        setVisible(false);          // scrolling down → hide
      } else {
        setVisible(true);           // scrolling up → show
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "rgba(12, 12, 12, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="h-14 flex items-center justify-center">
        <a
          href={isHome ? "#hero" : "/"}
          style={{ display: "flex", alignItems: "center" }}
          onClick={(e) => {
            if (isHome) { e.preventDefault(); scrollTo("#hero"); }
          }}
        >
          <Image
            src="/logo.svg"
            alt="walano design"
            width={28}
            height={20}
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </a>
      </div>
    </header>
  );
}
