import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProject, fetchProjects } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const revalidate = 3600;

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export async function generateStaticParams() {
  const projects = await fetchProjects();
  return projects.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(Number(id));
  if (!project) return { title: "Projet" };
  return {
    title: project.title,
    description: project.description || `${project.title} — ${project.category} par Walano Design, graphiste freelance.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await fetchProject(Number(id));
  if (!project) notFound();

  const images  = project.images.map((img) => img.url).filter(Boolean);
  const ytId    = project.youtube_url ? getYouTubeId(project.youtube_url) : null;
  const hasMedia = images.length > 0 || ytId;

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <Nav />
      <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Title */}
        <h1
          style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "clamp(1.8rem, 5vw, 3.2rem)",
            color:         "#f5f3f7",
            marginBottom:  "0.5rem",
            fontWeight:    700,
            lineHeight:    1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {project.title}
        </h1>
        <p
          style={{
            fontFamily:    "Inter, sans-serif",
            fontSize:      "0.85rem",
            color:         "rgba(245,243,247,0.4)",
            letterSpacing: "0.06em",
            textTransform: "lowercase",
            marginBottom:  "3rem",
          }}
        >
          {project.category}
        </p>

        {/* YouTube embed — full width 16/9 */}
        {ytId && (
          <div
            style={{
              position:     "relative",
              width:        "100%",
              aspectRatio:  "16/9",
              marginBottom: images.length > 0 ? "2rem" : 0,
              background:   "#0c0c0c",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        )}

        {/* Image grid — shown for non-video projects or when there are extra images */}
        {images.length > 0 && (
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap:                 "1rem",
            }}
          >
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`${project.title} — ${project.category}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ))}
          </div>
        )}

        {!hasMedia && (
          <p style={{ fontFamily: "Inter, sans-serif", color: "rgba(245,243,247,0.3)", fontSize: "0.85rem" }}>
            aucun média disponible
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
