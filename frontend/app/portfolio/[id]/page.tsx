import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProject, fetchProjects } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const revalidate = 3600; // re-generate at most once per hour

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
  if (!project) return { title: "Projet | Walano Design" };
  return {
    title: project.title,
    description: `${project.title} — ${project.category} par Walano Design, graphiste freelance.`,
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

  const images = project.images.map((img) => img.url).filter(Boolean);

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <Nav />
      <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontFamily:   "austin-pen, cursive",
            fontSize:     "clamp(2rem, 6vw, 4rem)",
            color:        "#f5f3f7",
            marginBottom: "0.5rem",
            fontWeight:   400,
            lineHeight:   1,
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
      </div>
      <Footer />
    </main>
  );
}
