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

/**
 * **text** → white bold
 * *text*   → violet (clickable if it looks like a URL)
 */
function toHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f5f3f7;font-weight:700">$1</strong>')
    .replace(/\*([^*]+)\*/g, (_full, txt: string) => {
      const href = /^https?:\/\//.test(txt)            ? txt
                 : !txt.includes(" ") && txt.includes(".") ? `https://${txt}`
                 : null;
      return href
        ? `<a href="${href}" target="_blank" rel="noopener noreferrer" class="article-link" style="color:#855c9d;text-decoration:none">${txt}</a>`
        : `<span style="color:#855c9d">${txt}</span>`;
    });
}

/** Convert a social/video URL to an embeddable iframe src */
function toEmbedSrc(url: string): string | null {
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (igMatch) return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed/`;

  const ytMatch = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  if (/twitter\.com|x\.com/.test(url)) return null;

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
                  lineHeight:    1.5,
                  marginTop:     "0.75rem",
                  marginBottom:  "0.01rem",
                }}
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={i}
                className="article-body"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: toHtml(block.text) }}
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
            const isInstagram = /instagram\.com/.test(block.url);
            return (
              <div key={i} style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
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
                    fontFamily:      "Inter, sans-serif",
                    fontSize:        "0.75rem",
                    color:           "rgba(245,243,247,0.35)",
                    margin:          0,
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

  return (
    <>
      <style>{`
        .blog-back {
          display:        inline-block;
          border:         1px solid rgba(245,243,247,0.15);
          border-radius:  0;
          padding:        0.3rem 0.9rem;
          font-family:    Inter, sans-serif;
          font-size:      0.75rem;
          font-weight:    500;
          letter-spacing: 0.03em;
          color:          rgba(245,243,247,0.45);
          text-decoration: none;
          transition:     color 0.2s, border-color 0.2s;
        }
        .blog-back:hover {
          color:        rgba(245,243,247,0.9) !important;
          border-color: rgba(245,243,247,0.35);
        }
        .article-link:hover { opacity: 0.75; }
        @media (max-width: 640px) {
          .article-body p { text-align: justify; }
        }
      `}</style>
      <article style={{
        flex:     1,
        maxWidth: "52rem",
        margin:   "0 auto",
        width:    "100%",
        padding:  "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)",
      }}>
        {/* Back link */}
        <a href="/blog" className="blog-back" style={{ marginBottom: "2rem" }}>
          {lang === "en" ? "Blog" : "Blog"}
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
          <a href="/blog" className="blog-back">
            {lang === "en" ? "Back to Blog" : "Retour au Blog"}
          </a>
        </div>
      </article>
    </>
  );
}
