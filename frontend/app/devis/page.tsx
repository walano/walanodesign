"use client";

import Estimate from "@/components/Estimate";
import Nav from "@/components/Nav";

export default function DevisPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#855c9d" }}>
      <Nav />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.5rem 4rem",
      }}>
        <Estimate />
      </div>
    </main>
  );
}
