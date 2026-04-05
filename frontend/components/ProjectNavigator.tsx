"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Project } from "@/lib/api";

export interface ProjectNavState {
  projects:     Project[];
  projectIndex: number;
}

interface Slide {
  projectIdx: number;
  imageIdx:   number;
  url:        string;
  title:      string;
  imageCount: number;
  isBranding: boolean;
  allImages:  { url: string }[];
}

export default function ProjectNavigator({
  projects,
  projectIndex,
  onClose,
}: ProjectNavState & { onClose: () => void }) {
  const slides: Slide[] = projects.flatMap((p, pIdx) => {
    const isBranding = p.sub_type === "branding";
    const allImages  = p.images;

    if (isBranding) {
      const s: Slide = {
        projectIdx: pIdx, imageIdx: 0,
        url: allImages[0]?.url || "", title: p.title,
        imageCount: allImages.length, isBranding, allImages,
      };
      return [s];
    }

    const imgs = allImages.length > 0 ? allImages : (p.yt_thumbnail ? [{ url: p.yt_thumbnail }] : []);
    if (imgs.length === 0) return [];
    return imgs.map((img, iIdx): Slide => ({
      projectIdx: pIdx, imageIdx: iIdx,
      url: img.url, title: p.title,
      imageCount: imgs.length, isBranding, allImages: imgs,
    }));
  });

  const initialSlide = Math.max(0, slides.findIndex(s => s.projectIdx === projectIndex));
  const [curIdx, setCurIdx] = useState(initialSlide);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Jump to initial slide on mount
  useEffect(() => {
    if (initialSlide === 0) return;
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft = initialSlide * scrollRef.current.clientWidth;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    const updateIdx = () => {
      if (!scrollRef.current) return;
      setCurIdx(c => {
        const next = Math.round(scrollRef.current!.scrollLeft / scrollRef.current!.clientWidth);
        return Math.min(Math.max(next, 0), slides.length - 1) !== c
          ? Math.min(Math.max(next, 0), slides.length - 1)
          : c;
      });
    };
    let debounce: ReturnType<typeof setTimeout>;
    const onScroll = () => { clearTimeout(debounce); debounce = setTimeout(updateIdx, 80); };
    el?.addEventListener("scrollend", updateIdx);
    el?.addEventListener("scroll",    onScroll);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (!scrollRef.current) return;
      const cur = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      if (e.key === "ArrowLeft")  scrollToIdx(cur - 1);
      if (e.key === "ArrowRight") scrollToIdx(cur + 1);
    };
    window.addEventListener("keydown", onKey);

    document.body.style.overflow           = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.dataset.viewerOpen       = "1";

    return () => {
      el?.removeEventListener("scrollend", updateIdx);
      el?.removeEventListener("scroll",    onScroll);
      clearTimeout(debounce);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow           = "";
      document.body.style.overscrollBehavior = "";
      delete document.body.dataset.viewerOpen;
    };
  }, [onClose, slides.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToIdx = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.min(Math.max(i, 0), slides.length - 1);
    scrollRef.current.scrollTo({ left: clamped * scrollRef.current.clientWidth, behavior: "smooth" });
    setCurIdx(clamped);
  }, [slides.length]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const slide = slides[curIdx];
    if (!slide || slide.imageCount <= 1 || slide.isBranding) return;
    (thumbsRef.current.children[slide.imageIdx] as HTMLElement | undefined)
      ?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [curIdx, slides]);

  const slide = slides[curIdx];
  if (!slide) return null;

  const showThumbs       = slide.imageCount > 1 && !slide.isBranding;
  const hasAnyThumbnails = slides.some(s => s.imageCount > 1 && !s.isBranding);
  const projectStartIdx  = slides.findIndex(s => s.projectIdx === slide.projectIdx);

  const btnStyle: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 30,
    alignItems: "center", justifyContent: "center",
    padding: "1rem 0.75rem",
    background: "rgba(12,12,12,0.7)", border: "none",
    backdropFilter: "blur(10px)", color: "#f5f3f7",
    fontWeight: 300, fontSize: "1.6rem", lineHeight: 1,
    cursor: "pointer", transition: "background 0.2s",
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <style>{`
        .proj-snap::-webkit-scrollbar { display: none; }
        .brand-proj-scroll::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .brand-proj-scroll::-webkit-scrollbar { display: block; width: 4px; }
          .brand-proj-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
          .brand-proj-scroll::-webkit-scrollbar-thumb { background: rgba(133,92,157,0.6); border-radius: 2px; }
          .brand-proj-scroll { scrollbar-width: thin; scrollbar-color: rgba(133,92,157,0.6) rgba(255,255,255,0.05); }
        }
        .thumb-strip::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Carousel ── */}
      <div
        ref={scrollRef}
        className="proj-snap"
        data-lenis-prevent
        style={{
          position: "absolute", inset: 0,
          display: "flex",
          overflowX: "scroll", overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          overscrollBehavior: "contain",
          transform: "translateZ(0)",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0, width: "100%", height: "100%",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              paddingTop: s.isBranding ? 0 : "3.5rem",
              paddingBottom: hasAnyThumbnails ? "4rem" : 0,
            }}
          >
            {s.isBranding ? (
              <div className="w-full h-full md:w-[60vw] md:h-[85vh] md:max-w-4xl flex-shrink-0"
                style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                <div className="brand-proj-scroll" data-lenis-prevent
                  style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingTop: "2rem" }}
                >
                  {s.allImages.map((img, ii) => (
                    <div key={ii} style={{ lineHeight: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {img.url && <img src={img.url} alt={`${s.title} ${ii + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />}
                    </div>
                  ))}
                </div>
              </div>
            ) : s.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.url} alt={s.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
            ) : (
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.8rem", color: "rgba(133,92,157,0.4)" }}>{s.title}</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          backgroundColor: "#0c0c0c",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.5)", textTransform: "lowercase" }}>
          {slide.title}
          {showThumbs && <span style={{ color: "rgba(245,243,247,0.3)" }}> — {slide.imageIdx + 1}/{slide.imageCount}</span>}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {projects.length > 1 && (
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "rgba(245,243,247,0.3)", letterSpacing: "0.06em" }}>
              {slide.projectIdx + 1} / {projects.length}
            </span>
          )}
          <button onClick={onClose} style={{ color: "#f5f3f7", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem" }}>✕</button>
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      {showThumbs && (
        <div
          ref={thumbsRef}
          className="thumb-strip"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
            display: "flex", gap: "0.35rem",
            padding: "0.5rem 1rem 0.75rem",
            overflowX: "auto", justifyContent: "center",
            scrollbarWidth: "none",
            backgroundColor: "#0c0c0c",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {slide.allImages.map((img, ii) => (
            <div
              key={ii}
              onClick={() => scrollToIdx(projectStartIdx + ii)}
              style={{
                width: 64, height: 36, flexShrink: 0, cursor: "pointer",
                opacity: ii === slide.imageIdx ? 1 : 0.4,
                outline: ii === slide.imageIdx ? "2px solid #855c9d" : "2px solid transparent",
                backgroundColor: "#0c0c0c", overflow: "hidden",
                transition: "opacity 0.2s, outline 0.2s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img.url && <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
          ))}
        </div>
      )}

      {/* ── Desktop prev/next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            className="hidden md:flex"
            style={{ ...btnStyle, left: 0 }}
            onClick={() => scrollToIdx(curIdx - 1)}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.7)")}
          >‹</button>
          <button
            className="hidden md:flex"
            style={{ ...btnStyle, right: 0 }}
            onClick={() => scrollToIdx(curIdx + 1)}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,92,157,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(12,12,12,0.7)")}
          >›</button>
        </>
      )}
    </div>
  );
}
