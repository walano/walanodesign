"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { BlogPost } from "@/lib/api";

type BlogCat = "branding" | "tendances" | "process";

const CATEGORIES: BlogCat[] = ["branding", "tendances", "process"];

const CAT_LABEL: Record<BlogCat, { fr: string; en: string }> = {
  branding:  { fr: "Branding",  en: "Branding" },
  tendances: { fr: "Tendances", en: "Trends"   },
  process:   { fr: "Process",   en: "Process"  },
};

function formatDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const { lang } = useI18n();
  const [active, setActive] = useState<BlogCat | null>(null);

  const allLabel = lang === "en" ? "All" : "Tout";
  const filtered = active ? posts.filter(p => p.category === active) : posts;

  return (
    <div style={{
      flex:    1,
      maxWidth: "72rem",
      margin:  "0 auto",
      width:   "100%",
      padding: "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)",
    }}>
      <style>{`
        .blog-card {
          background:      rgba(255,255,255,0.04);
          border:          1px solid rgba(255,255,255,0.07);
          overflow:        hidden;
          display:         flex;
          flex-direction:  column;
          text-decoration: none;
          transition:      border-color 0.25s, background 0.25s;
        }
        .blog-card:hover {
          background:   rgba(133,92,157,0.08);
          border-color: rgba(133,92,157,0.3);
        }
        .blog-grid {
          display:               grid;
          grid-template-columns: 1fr;
          gap:                   1.5rem;
        }
        @media (min-width: 640px)  { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .blog-grid { grid-template-columns: repeat(3, 1fr); } }
        .blog-tab {
          background:    none;
          border:        none;
          border-bottom: 2px solid transparent;
          padding:       0.5rem 0;
          cursor:        pointer;
          font-family:   Inter, sans-serif;
          font-size:     clamp(0.82rem, 1.2vw, 0.9rem);
          font-weight:   500;
          color:         rgba(245,243,247,0.45);
          letter-spacing: 0.02em;
          transition:    color 0.2s, border-color 0.2s;
          white-space:   nowrap;
        }
        .blog-tab:hover { color: rgba(245,243,247,0.8); }
        .blog-tab.active {
          color:        #f5f3f7;
          border-color: #855c9d;
        }
      `}</style>

      {/* Title */}
      <h1 style={{
        fontFamily:   "Inter, sans-serif",
        fontSize:     "clamp(2.5rem, 7vw, 5rem)",
        color:        "#f5f3f7",
        lineHeight:   1,
        fontWeight:   700,
        marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        letterSpacing: "-0.03em",
      }}>
        {lang === "en" ? "Let's talk about design" : "Parlons de design"}
      </h1>

      {/* Category tabs */}
      <div style={{
        display:       "flex",
        gap:           "clamp(1.25rem, 3vw, 2rem)",
        marginBottom:  "clamp(2rem, 4vw, 3rem)",
        borderBottom:  "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "0",
        overflowX:     "auto",
      }}>
        <button
          className={`blog-tab${active === null ? " active" : ""}`}
          onClick={() => setActive(null)}
        >
          {allLabel}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`blog-tab${active === cat ? " active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {CAT_LABEL[cat][lang as "fr" | "en"] ?? CAT_LABEL[cat].fr}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? null : (
        <div className="blog-grid">
          {filtered.map(post => {
            const title = lang === "en" && post.title_en ? post.title_en : post.title;
            const desc  = lang === "en" && post.description_en ? post.description_en : post.description;

            return (
              <a key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                {/* Thumbnail */}
                {post.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.thumbnail}
                    alt={title}
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", aspectRatio: "16/9",
                    background: "rgba(133,92,157,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "austin-pen, cursive", fontSize: "2rem", color: "rgba(133,92,157,0.3)" }}>wd</span>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1 }}>
                  <span style={{
                    fontFamily:    "Inter, sans-serif",
                    fontSize:      "0.65rem",
                    fontWeight:    600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:         "#855c9d",
                  }}>
                    {CAT_LABEL[post.category as BlogCat]?.[lang as "fr" | "en"] ?? post.category}
                  </span>

                  <h2 style={{
                    fontFamily:   "Inter, sans-serif",
                    fontSize:     "clamp(0.88rem, 1.3vw, 0.98rem)",
                    fontWeight:   600,
                    color:        "#f5f3f7",
                    lineHeight:   1.35,
                    margin:       0,
                    letterSpacing: "-0.01em",
                  }}>
                    {title}
                  </h2>

                  <p style={{
                    fontFamily:          "Inter, sans-serif",
                    fontSize:            "0.8rem",
                    color:               "rgba(245,243,247,0.42)",
                    lineHeight:          1.55,
                    margin:              0,
                    display:             "-webkit-box",
                    WebkitLineClamp:     3,
                    WebkitBoxOrient:     "vertical",
                    overflow:            "hidden",
                  }}>
                    {desc}
                  </p>

                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize:   "0.7rem",
                    color:      "rgba(245,243,247,0.22)",
                    marginTop:  "auto",
                    paddingTop: "0.5rem",
                  }}>
                    {formatDate(post.published_at, lang)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
