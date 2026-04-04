"use client";

import { useI18n } from "@/lib/i18n";
import type { BlogPost, ContentBlock } from "@/lib/api";

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

/** Parse **bold** and *violet* inline markers into React nodes */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold** before *violet* to avoid conflict
  const regex = /\*\*(.+?)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(
        <strong key={match.index} style={{ color: "#f5f3f7", fontWeight: 700 }}>
          {match[1]}
        </strong>
      );
    } else {
      const txt  = match[2];
      const href = /^https?:\/\//.test(txt) ? txt
                 : /^www\./.test(txt)        ? `https://${txt}`
                 : null;
      parts.push(
        href ? (
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link"
            style={{ color: "#855c9d", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            {txt}
          </a>
        ) : (
          <span key={match.index} style={{ color: "#855c9d" }}>{txt}</span>
        )
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Convert a social/video URL to an embeddable iframe src */
function toEmbedSrc(url: string): string | null {
  // Instagram: https://www.instagram.com/p/{id}/ or /reel/{id}/
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (igMatch) return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed/`;

  // YouTube: https://youtu.be/{id} or ?v={id}
  const ytMatch = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Twitter / X: https://twitter.com/user/status/{id} or x.com/...
  // Twitter doesn't support plain iframes — return null, fall back to link
  if (/twitter\.com|x\.com/.test(url)) return null;

  // Generic: assume the URL itself is embeddable (e.g. already an iframe src)
  return url;
}

function BlockContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h3
                key={i}
                style={{
                  fontFamily:    "Inter, sans-serif",
                  fontWeight:    600,
                  fontSize:      "clamp(0.95rem, 1.6vw, 1.05rem)",
                  color:         "#f5f3f7",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  marginTop:     "0.75rem",
                  marginBottom:  "-0.25rem",
                }}
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={i}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize:   "clamp(0.88rem, 1.3vw, 1rem)",
                  fontWeight: 400,
                  color:      "rgba(245,243,247,0.72)",
                  lineHeight: 1.78,
                  margin:     0,
                }}
              >
                {parseInline(block.text)}
              </p>
            );

          case "image":
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={block.url}
                alt={block.alt ?? ""}
                style={{
                  width:        "100%",
                  maxHeight:    "32rem",
                  objectFit:    "cover",
                  display:      "block",
                  marginTop:    "0.5rem",
                  marginBottom: "0.5rem",
                }}
              />
            );

          case "link":
            return (
              <p key={i} style={{ margin: 0 }}>
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                  style={{
                    fontFamily:          "Inter, sans-serif",
                    fontSize:            "clamp(0.88rem, 1.3vw, 1rem)",
                    color:               "#855c9d",
                    textDecoration:      "underline",
                    textUnderlineOffset: "3px",
                    transition:          "opacity 0.2s",
                  }}
                >
                  {block.text}
                </a>
              </p>
            );

          case "embed": {
            const src = toEmbedSrc(block.url);
            if (!src) {
              // Fallback: render as a violet link
              return (
                <p key={i} style={{ margin: 0 }}>
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                    style={{
                      fontFamily:          "Inter, sans-serif",
                      fontSize:            "clamp(0.88rem, 1.3vw, 1rem)",
                      color:               "#855c9d",
                      textDecoration:      "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {block.caption ?? block.url}
                  </a>
                </p>
              );
            }
            // Instagram-style: tall aspect ratio; YouTube: 16/9
            const isInstagram = /instagram\.com/.test(block.url);
            return (
              <div
                key={i}
                style={{
                  marginTop:    "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <iframe
                  src={src}
                  style={{
                    width:        "100%",
                    aspectRatio:  isInstagram ? "4/5" : "16/9",
                    border:       "none",
                    display:      "block",
                    borderRadius: "2px",
                    background:   "#111",
                  }}
                  allowFullScreen
                  loading="lazy"
                  title={block.caption ?? "embedded content"}
                />
                {block.caption && (
                  <p style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize:   "0.75rem",
                    color:      "rgba(245,243,247,0.35)",
                    marginTop:  "0.4rem",
                    margin:     0,
                    marginBlockStart: "0.4rem",
                  }}>
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

export default function ArticleBody({ post }: { post: BlogPost }) {
  const { lang } = useI18n();

  const title    = lang === "en" && post.title_en   ? post.title_en   : post.title;
  const blocks   = (lang === "en" && post.content_en?.length ? post.content_en : post.content) ?? [];
  const catLabel = CAT_LABEL[post.category as BlogCat]?.[lang as "fr" | "en"] ?? post.category;
  const backLabel       = lang === "en" ? "← blog"         : "← blog";
  const backBottomLabel = lang === "en" ? "← back to blog" : "← retour au blog";

  return (
    <>
      <style>{`
        .blog-back:hover   { color: #855c9d !important; }
        .article-link:hover { opacity: 0.75; }
      `}</style>
      <article style={{
        flex:     1,
        maxWidth: "52rem",
        margin:   "0 auto",
        width:    "100%",
        padding:  "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)",
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
          fontFamily:    "Inter, sans-serif",
          fontSize:      "clamp(1.6rem, 4vw, 2.8rem)",
          color:         "#f5f3f7",
          lineHeight:    1.15,
          fontWeight:    700,
          letterSpacing: "-0.03em",
          marginBottom:  "2rem",
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

        {/* Block content */}
        {blocks.length > 0 && <BlockContent blocks={blocks} />}

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
