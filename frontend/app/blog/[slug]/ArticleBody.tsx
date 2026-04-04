"use client";

import { useI18n } from "@/lib/i18n";
import type { BlogPost } from "@/lib/api";

type BlogCat = "branding" | "tendances" | "process";

const CAT_LABEL: Record<string, { fr: string; en: string }> = {
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

/** Renders markdown content: **Heading** blocks and inline **bold** */
function MarkdownContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        const headingMatch = trimmed.match(/^\*\*([^*]+)\*\*/);

        if (headingMatch) {
          return (
            <h3
              key={i}
              style={{
                fontFamily:   "Inter, sans-serif",
                fontSize:     "clamp(0.95rem, 1.5vw, 1.05rem)",
                fontWeight:   600,
                color:        "#f5f3f7",
                letterSpacing: "-0.01em",
                marginTop:    "0.5rem",
                marginBottom: 0,
              }}
            >
              {headingMatch[1]}
            </h3>
          );
        }

        const html = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        return (
          <p
            key={i}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize:   "clamp(0.88rem, 1.3vw, 1rem)",
              fontWeight: 400,
              color:      "rgba(245,243,247,0.72)",
              lineHeight: 1.78,
              margin:     0,
            }}
          />
        );
      })}
    </div>
  );
}

export default function ArticleBody({ post }: { post: BlogPost }) {
  const { lang } = useI18n();

  const title   = lang === "en" && post.title_en   ? post.title_en   : post.title;
  const content = lang === "en" && post.content_en ? post.content_en : (post.content ?? "");
  const catLabel = CAT_LABEL[post.category as BlogCat]?.[lang as "fr" | "en"] ?? post.category;
  const backLabel       = lang === "en" ? "← blog"           : "← blog";
  const backBottomLabel = lang === "en" ? "← back to blog"   : "← retour au blog";

  return (
    <>
      <style>{`
        .blog-back:hover { color: #855c9d !important; }
      `}</style>
      <article style={{
        flex:      1,
        maxWidth:  "52rem",
        margin:    "0 auto",
        width:     "100%",
        padding:   "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)",
      }}>
        {/* Back link */}
        <a
          href="/blog"
          className="blog-back"
          style={{
            fontFamily:     "Inter, sans-serif",
            fontSize:       "0.78rem",
            color:          "rgba(245,243,247,0.32)",
            textDecoration: "none",
            letterSpacing:  "0.04em",
            display:        "inline-block",
            marginBottom:   "2rem",
            transition:     "color 0.2s",
          }}
        >
          {backLabel}
        </a>

        {/* Category + date */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.9rem" }}>
          <span style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "0.65rem",
            fontWeight:    600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#855c9d",
          }}>
            {catLabel}
          </span>
          <span style={{ color: "rgba(245,243,247,0.18)", fontSize: "0.7rem" }}>·</span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "0.75rem",
            color:      "rgba(245,243,247,0.28)",
          }}>
            {formatDate(post.published_at, lang)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:   "Inter, sans-serif",
          fontSize:     "clamp(1.6rem, 4vw, 2.8rem)",
          color:        "#f5f3f7",
          lineHeight:   1.15,
          fontWeight:   700,
          letterSpacing: "-0.03em",
          marginBottom: "2rem",
        }}>
          {title}
        </h1>

        {/* Thumbnail */}
        {post.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail}
            alt={title}
            style={{
              width:        "100%",
              aspectRatio:  "16/9",
              objectFit:    "cover",
              display:      "block",
              marginBottom: "2.5rem",
            }}
          />
        )}

        {/* Content */}
        {content && <MarkdownContent content={content} />}

        {/* Bottom back link */}
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a
            href="/blog"
            className="blog-back"
            style={{
              fontFamily:     "Inter, sans-serif",
              fontSize:       "0.8rem",
              color:          "rgba(245,243,247,0.32)",
              textDecoration: "none",
              letterSpacing:  "0.04em",
              transition:     "color 0.2s",
            }}
          >
            {backBottomLabel}
          </a>
        </div>
      </article>
    </>
  );
}
