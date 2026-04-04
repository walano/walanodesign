import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchBlogPosts } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogListClient from "./BlogListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Blog | Walano Design",
  description: "Conseils en branding, direction artistique et process par Walano Design, graphiste freelance.",
};

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0c0c0c", display: "flex", flexDirection: "column" }}>
      <Nav />
      <Suspense>
        <BlogListClient posts={posts} />
      </Suspense>
      <Footer />
    </main>
  );
}
