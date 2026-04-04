import type { MetadataRoute } from "next";
import { fetchBlogPosts, fetchProjects } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base     = "https://www.walanodesign.com";
  const [posts, projects] = await Promise.all([fetchBlogPosts(), fetchProjects()]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url:             `${base}/blog/${p.slug}`,
    lastModified:    p.published_at ? new Date(p.published_at) : new Date(),
    changeFrequency: "monthly",
    priority:        0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url:             `${base}/portfolio/${p.id}`,
    lastModified:    new Date(),
    changeFrequency: "monthly",
    priority:        0.65,
  }));

  return [
    { url: base,                       lastModified: new Date(), changeFrequency: "monthly", priority: 1   },
    { url: `${base}/portfolio`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/blog`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.75 },
    ...blogEntries,
    ...projectEntries,
    { url: `${base}/devis`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/conditions`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/confidentialite`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
