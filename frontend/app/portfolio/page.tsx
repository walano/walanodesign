import { Suspense } from "react";
import { fetchProjects, Project } from "@/lib/api";
import PortfolioClient from "./PortfolioClient";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params   = await searchParams;
  const category = params.category || "covers";

  let initialProjects: Project[] = [];
  try {
    initialProjects = await fetchProjects(category);
  } catch {}

  return (
    <Suspense>
      <PortfolioClient initialProjects={initialProjects} />
    </Suspense>
  );
}
