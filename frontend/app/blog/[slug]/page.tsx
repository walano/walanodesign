import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogPost, fetchBlogPosts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleBody from "./ArticleBody";

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
      <ArticleBody post={post} />
      <Footer />
    </main>
  );
}
