"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { lenisRef } from "@/lib/lenis";
import { useI18n } from "@/lib/i18n";

export interface ViewerImage {
  src?: string;
  label?: string;
  aspectRatio?: string;
  backgroundColor?: string;
}

interface Props {
  images: ViewerImage[];
  initialIndex: number;
  onClose: () => void;
  showThumbnails?: boolean;
}

export default function ImageViewer({ images, initialIndex, onClose, showThumbnails }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [ready, setReady] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { t } = useI18n();
  const img = images[index];

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
    lenisRef.current?.stop();
    return () => { lenisRef.current?.start(); };
  }, []);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaX > 30 || e.deltaY > 30)  next();
      if (e.deltaX < -30 || e.deltaY < -30) prev();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [onClose, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) delta < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position:             "fixed",
        inset:                0,
        zIndex:               9999,
        display:              "flex",
        flexDirection:        "column",
        backgroundColor:      ready ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition:           "background-color 0.25s ease",
        opacity:              ready ? 1 : 0,
      }}
    >
      {/* ── Counter — above image ── */}
      {images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            textAlign:  "center",
            padding:    "1rem 1.5rem 0",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.72rem",
              letterSpacing: "0.06em",
              color:         "rgba(245,243,247,0.4)",
            }}
          >
            {index + 1} / {images.length}
          </span>
        </div>
      )}

      {/* ── Image area — fills all available height ── */}
      <div
        style={{
          flex:           1,
          minHeight:      0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          position:       "relative",
          padding:        "clamp(0.5rem, 2vw, 2rem)",
          transform:      ready ? "scale(1)" : "scale(0.97)",
          transition:     "transform 0.25s ease",
        }}
      >
        {img.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.src}
            alt={img.label ?? ""}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth:   "100%",
              maxHeight:  "100%",
              objectFit:  "contain",
              display:    "block",
            }}
          />
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: img.backgroundColor ?? "#0c0c0c",
              aspectRatio:     img.aspectRatio ?? "1",
              maxWidth:        "100%",
              maxHeight:       "100%",
              width:           "100%",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
            }}
          >
            <span
              style={{
                fontFamily:    "Inter, sans-serif",
                fontSize:      "0.7rem",
                letterSpacing: "0.08em",
                color:         "rgba(133,92,157,0.4)",
                textTransform: "lowercase",
              }}
            >
              {img.label ?? "image"}
            </span>
          </div>
        )}

        {/* Prev arrow — desktop only, swipe on mobile */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="hidden md:flex"
            style={{
              position:       "absolute",
              left:           "clamp(0.5rem, 2vw, 1.5rem)",
              top:            "50%",
              transform:      "translateY(-50%)",
              padding:        "0.5rem 1rem",
              alignItems:     "center",
              justifyContent: "center",
              background:     "rgba(12,12,12,0.55)",
              border:         "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color:          "#f5f3f7",
              fontFamily:     "Inter, sans-serif",
              fontWeight:     600,
              fontSize:       "0.72rem",
              letterSpacing:  "0.06em",
              cursor:         "pointer",
              transition:     "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(133,92,157,0.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(12,12,12,0.55)")}
          >
            prev
          </button>
        )}

        {/* Next button — desktop only */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="hidden md:flex"
            style={{
              position:       "absolute",
              right:          "clamp(0.5rem, 2vw, 1.5rem)",
              top:            "50%",
              transform:      "translateY(-50%)",
              padding:        "0.5rem 1rem",
              alignItems:     "center",
              justifyContent: "center",
              background:     "rgba(12,12,12,0.55)",
              border:         "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color:          "#f5f3f7",
              fontFamily:     "Inter, sans-serif",
              fontWeight:     600,
              fontSize:       "0.72rem",
              letterSpacing:  "0.06em",
              cursor:         "pointer",
              transition:     "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(133,92,157,0.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(12,12,12,0.55)")}
          >
            next
          </button>
        )}
      </div>

      {/* ── Thumbnail strip (pack images) ── */}
      {showThumbnails && images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent
          style={{
            display:         "flex",
            gap:             "0.35rem",
            padding:         "0 1rem 0.75rem",
            overflowX:       "auto",
            justifyContent:  "center",
            flexShrink:      0,
            scrollbarWidth:  "none",
          }}
        >
          {images.map((thumb, thumbI) => (
            <div
              key={thumbI}
              onClick={() => setIndex(thumbI)}
              style={{
                width:           96,
                height:          54,
                flexShrink:      0,
                cursor:          "pointer",
                opacity:         thumbI === index ? 1 : 0.4,
                outline:         thumbI === index ? "2px solid #855c9d" : "2px solid transparent",
                backgroundColor: "#0c0c0c",
                overflow:        "hidden",
                transition:      "opacity 0.2s, outline 0.2s",
              }}
            >
              {thumb.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom bar — close button ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "1rem 1.5rem",
          flexShrink:     0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding:        "0.6rem 1.8rem",
            fontFamily:     "Inter, sans-serif",
            fontWeight:     600,
            fontSize:       "clamp(0.72rem, 0.95vw, 1rem)",
            letterSpacing:  "0.04em",
            textTransform:  "lowercase",
            background:     "rgba(255,255,255,0.08)",
            border:         "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            color:          "#f5f3f7",
            cursor:         "pointer",
            transition:     "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = "rgba(255,255,255,0.15)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
        >
          {t("viewer.close")}
        </button>
      </div>
    </div>
  );
}
