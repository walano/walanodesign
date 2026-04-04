import type { Metadata } from "next";
import { fetchBlogPosts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:       "Blog | Walano Design",
  description: "Conseils en branding, tarifs, process et direction artistique par Walano Design, graphiste freelance.",
};

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

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0c0c0c", display: "flex", flexDirection: "column" }}>
      <Nav />

      <div style={{ flex: 1, maxWidth: "72rem", margin: "0 auto", width: "100%", padding: "clamp(6rem, 12vw, 9rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <h1 style={{
            fontFamily: "austin-pen, cursive",
            fontSize:   "clamp(3.5rem, 10vw, 8rem)",
            color:      "#f5f3f7",
            lineHeight: 1,
            fontWeight: 400,
          }}>
            blog
          </h1>
          <p style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "clamp(0.8rem, 1.2vw, 0.9rem)",
            color:         "rgba(245,243,247,0.4)",
            letterSpacing: "0.04em",
            marginTop:     "0.75rem",
          }}>
            design, branding, musique & direction artistique
          </p>
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p style={{ fontFamily: "Inter, sans-serif", color: "rgba(245,243,247,0.35)", fontSize: "0.9rem" }}>
            aucun article pour l&apos;instant.
          </p>
        ) : (
          <>
            <style>{`
              .blog-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
              }
              @media (min-width: 640px) {
                .blog-grid { grid-template-columns: repeat(2, 1fr); }
              }
              @media (min-width: 1024px) {
                .blog-grid { grid-template-columns: repeat(3, 1fr); }
              }
              .blog-card {
                background:    rgba(255,255,255,0.04);
                border:        1px solid rgba(255,255,255,0.07);
                border-radius: 6px;
                overflow:      hidden;
                display:       flex;
                flex-direction: column;
                text-decoration: none;
                transition:    border-color 0.25s, background 0.25s;
              }
              .blog-card:hover {
                background:   rgba(133,92,157,0.08);
                border-color: rgba(133,92,157,0.3);
              }
            `}</style>
            <div className="blog-grid">
              {posts.map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  {/* Thumbnail */}
                  {post.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(133,92,157,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "austin-pen, cursive", fontSize: "2rem", color: "rgba(133,92,157,0.4)" }}>wd</span>
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
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

                    <h2 style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize:   "clamp(0.92rem, 1.4vw, 1rem)",
                      fontWeight: 500,
                      color:      "#f5f3f7",
                      lineHeight: 1.35,
                      margin:     0,
                    }}>
                      {post.title}
                    </h2>

                    <p style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize:   "0.82rem",
                      color:      "rgba(245,243,247,0.45)",
                      lineHeight: 1.55,
                      margin:     0,
                      display:    "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow:   "hidden",
                    }}>
                      {post.description}
                    </p>

                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize:   "0.72rem",
                      color:      "rgba(245,243,247,0.25)",
                      marginTop:  "auto",
                      paddingTop: "0.5rem",
                    }}>
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
