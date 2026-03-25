"use client";

import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0c0c0c" }}>
      <Nav />
      <Contact />
      <Footer />
    </main>
  );
}
