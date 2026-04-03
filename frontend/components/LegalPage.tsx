"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

export interface LegalSection {
  title: string;
  body:  React.ReactNode;
}

export interface LegalContent {
  title:    string;
  subtitle: string;
  sections: LegalSection[];
}

interface Props {
  fr: LegalContent;
  en: LegalContent;
}

export default function LegalPage({ fr, en }: Props) {
  const { lang } = useI18n();
  const c = lang === "en" ? en : fr;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0c0c0c", display: "flex", flexDirection: "column" }}>
      <Nav />

      <div
        style={{
          flex:     1,
          maxWidth: "52rem",
          margin:   "0 auto",
          width:    "100%",
          padding:  "clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    700,
            fontSize:      "clamp(2rem, 5vw, 3.5rem)",
            color:         "#f5f3f7",
            lineHeight:    1.1,
            marginBottom:  "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {c.title}
        </h1>

        {/* Effective date */}
        <p
          style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    400,
            fontSize:      "0.8rem",
            color:         "rgba(245,243,247,0.35)",
            marginBottom:  "3rem",
            letterSpacing: "0.04em",
          }}
        >
          {c.subtitle}
        </p>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {c.sections.map((s, i) => (
            <section key={i}>
              <h2
                style={{
                  fontFamily:    "Inter, sans-serif",
                  fontWeight:    600,
                  fontSize:      "clamp(0.95rem, 1.6vw, 1.15rem)",
                  color:         "#855c9d",
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  marginBottom:  "0.4rem",
                }}
              >
                {s.title}
              </h2>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize:   "clamp(0.82rem, 1.4vw, 0.95rem)",
                  color:      "rgba(245,243,247,0.7)",
                  lineHeight: 1.65,
                }}
              >
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
