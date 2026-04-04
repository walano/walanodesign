import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogPost, fetchBlogPosts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: "Blog | Walano Design" };
  return {
    title:       `${post.title} | Walano Design`,
    description: post.description,
    openGraph: {
      title:       post.title,
      description: post.description,
      images:      post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  branding:  "branding",
  tarifs:    "tarifs",
  process:   "process",
  tendances: "tendances",
  musique:   "musique",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Simple markdown renderer — handles **heading** blocks and inline **bold** */
function ArticleContent({ content }: { content: string }) {
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
                fontFamily:    "Inter, sans-serif",
                fontSize:      "clamp(0.95rem, 1.5vw, 1.05rem)",
                fontWeight:    600,
                color:         "#f5f3f7",
                letterSpacing: "0",
                marginTop:     "0.5rem",
                marginBottom:  0,
              }}
            >
              {headingMatch[1]}
            </h3>
          );
        }

        // Inline bold replacement
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
              color:      "rgba(245,243,247,0.75)",
              lineHeight: 1.75,
              margin:     0,
            }}
          />
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0c0c0c", display: "flex", flexDirection: "column" }}>
      <Nav />

      <article style={{ flex: 1, maxWidth: "52rem", margin: "0 auto", width: "100%", padding: "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)" }}>

        {/* Back */}
        <a
          href="/blog"
          style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "0.78rem",
            color:         "rgba(245,243,247,0.35)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "0.3rem",
            marginBottom:  "2rem",
            transition:    "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#855c9d")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,243,247,0.35)")}
        >
          ← blog
        </a>

        {/* Category + date */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <span style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "0.68rem",
            fontWeight:    500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#855c9d",
          }}>
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <span style={{ color: "rgba(245,243,247,0.2)", fontSize: "0.7rem" }}>·</span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "0.75rem",
            color:      "rgba(245,243,247,0.3)",
          }}>
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:   "austin-pen, cursive",
          fontSize:     "clamp(2rem, 6vw, 3.5rem)",
          color:        "#f5f3f7",
          lineHeight:   1.1,
          fontWeight:   400,
          marginBottom: "2rem",
        }}>
          {post.title}
        </h1>

        {/* Thumbnail */}
        {post.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{
              width:        "100%",
              aspectRatio:  "16/9",
              objectFit:    "cover",
              borderRadius: "4px",
              display:      "block",
              marginBottom: "2.5rem",
            }}
          />
        )}

        {/* Content */}
        {post.content && <ArticleContent content={post.content} />}

        {/* Bottom back link */}
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a
            href="/blog"
            style={{
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.8rem",
              color:         "rgba(245,243,247,0.35)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition:    "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#855c9d")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,243,247,0.35)")}
          >
            ← retour au blog
          </a>
        </div>
      </article>

      <Footer />
    </main>
  );
}
