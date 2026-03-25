"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { fetchSiteConfig, fetchClients, type SiteConfig, type Client } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_CLIENTS: Client[] = [
  { id: 1, name: "Toossaint H.", role: "artiste",      avatar_url: null, order: 0 },
  { id: 2, name: "Trianon Homes",role: "entreprise",   avatar_url: null, order: 1 },
  { id: 3, name: "QLB Club",     role: "label",        avatar_url: null, order: 2 },
];

export default function About() {
  const { t } = useI18n();
  const sectionRef    = useRef<HTMLDivElement>(null);
  const photoRef      = useRef<HTMLDivElement>(null);
  const textRef       = useRef<HTMLDivElement>(null);
  const trustTitleRef = useRef<HTMLParagraphElement>(null);
  const avatarsRef    = useRef<HTMLDivElement>(null);

  const [config, setConfig]   = useState<SiteConfig | null>(null);
  const [clients, setClients] = useState<Client[]>(FALLBACK_CLIENTS);

  useEffect(() => {
    fetchSiteConfig().then(data => { if (data) setConfig(data); });
    fetchClients().then(data => { if (data.length > 0) setClients(data); });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(trustTitleRef.current, {
        scrollTrigger: { trigger: trustTitleRef.current, start: "top 88%" },
        y: 24, duration: 0.9, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>

      {/* ═══ QUI SUIS-JE ? ═══ */}
      <section
        id="about"
        className="about-section relative w-full overflow-hidden"
        style={{ paddingBlock: "clamp(1rem, 8vw, 8rem)", backgroundColor: "#0c0c0c" }}
      >
        {/* symbol.svg — full section background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/symbol.svg"
          alt=""
          aria-hidden
          className="about-symbol absolute inset-0 z-0 pointer-events-none w-full h-full"
          style={{ objectFit: "cover" }}
        />

        <style>{`
          @media (max-width: 767px) {
            .about-dark-box { max-height: none !important; }
            .about-dark-box h2 { text-align: center !important; }
            .about-dark-box p { text-align: justify !important; }
            .about-cta { align-self: center !important; margin-left: 0 !important; }
          }
        `}</style>

        {/* Content — centering grid */}
        <div
          className="relative z-10"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(clamp(1.5rem, 5vw, 6rem), 1fr) minmax(0, 72rem) minmax(clamp(1.5rem, 5vw, 6rem), 1fr)",
          }}
        >
          <div
            className="about-row flex flex-col md:flex-row md:items-stretch"
            style={{ gridColumn: 2, rowGap: "clamp(1.5rem, 3vw, 2.5rem)", columnGap: "0px" }}
          >
            {/* Photo */}
            <div
              ref={photoRef}
              className="relative flex-shrink-0 overflow-hidden self-center md:self-auto"
              style={{
                width: "clamp(200px, 28vw, 400px)",
                height: "clamp(200px, 28vw, 400px)",
              }}
            >
              <Image src={config?.about_photo_url || "/me.jpg"} alt="walano" fill className="object-cover object-top" />
            </div>

            {/* Dark box — title + text, capped to photo height */}
            <div
              ref={textRef}
              className="about-dark-box"
              style={{
                flex: 1,
                backgroundColor: "#0c0c0c",
                borderRadius: "0",
                padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxHeight: "clamp(200px, 28vw, 400px)",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontFamily: "austin-pen, cursive",
                  fontSize: "clamp(2rem, 4vw, 5rem)",
                  color: "#f5f3f7",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  paddingTop: "0.5rem",
                  paddingLeft: "1.2rem",
                  paddingBottom: "1.5rem",
                }}
              >
                {t("about.title")}
              </h2>
              <div
                style={{
                  display: "flex",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  flexDirection: "column",
                  gap: "0rem",
                  color: "var(--white)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
                  lineHeight: 1.8,
                  overflow: "hidden",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <p>{config?.about_text || t("about.p1")}</p>
              </div>
              <a
                href="/devis"
                className="about-cta"
                style={{
                  alignSelf: "flex-start",
                  flexShrink: 0,
                  marginLeft: "1rem",
                  padding: "0.6rem 1.5rem",
                  fontSize: "clamp(0.72rem, 0.95vw, 1rem)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  borderRadius: "0",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "var(--white)",
                  textTransform: "lowercase",
                  transition: "all 0.3s",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.18)";
                }}
              >
                {t("hero.estimate")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ILS M'ONT FAIT CONFIANCE ═══ */}
      <section
        className="trust-section"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          paddingBlock: "clamp(4rem, 8vw, 7rem)",
          backgroundColor: "#0c0c0c",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(clamp(1.5rem, 5vw, 6rem), 1fr) minmax(0, 72rem) minmax(clamp(1.5rem, 5vw, 6rem), 1fr)",
          }}
        >
          <div
            style={{
              gridColumn: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {/* Title */}
            <p
              ref={trustTitleRef}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.4rem, 3vw, 2.5rem)",
                color: "#f5f3f7",
                textAlign: "center",
                lineHeight: 1.4,
                letterSpacing: "-0.05",
              }}
            >
              {t("about.trust")}{" "}
              <em
                style={{
                  fontFamily: "source-serif-pro, serif",
                  fontStyle: "italic",
                  fontWeight: 900,
                  fontSize: "115%",
                  color: "#855c9d",
                }}
              >
                {t("about.trust_em")}
              </em>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}>.</span>
            </p>

            {/* Client avatars — infinite marquee */}
            <style>{`
              @keyframes marqueeScroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
              @media (prefers-reduced-motion: reduce) {
                .marquee-track { animation: none !important; }
              }
              .marquee-outer {
                mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
                -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
              }
            `}</style>

            <div className="marquee-outer" style={{ width: "100%", overflow: "hidden" }}>
              <div
                ref={avatarsRef}
                className="marquee-track"
                style={{
                  display: "flex",
                  width: "max-content",
                  animation: "marqueeScroll 28s linear infinite",
                }}
              >
                {[...Array(3)].flatMap((_, rep) =>
                  clients.map((client, ci) => (
                    <div
                      key={`${rep}-${ci}`}
                      style={{
                        display:       "flex",
                        flexDirection: "column",
                        alignItems:    "center",
                        gap:           "1rem",
                        paddingRight:  "clamp(1rem, 3vw, 10rem)",
                        flexShrink:    0,
                      }}
                    >
                      {/* Avatar circle */}
                      <div
                        style={{
                          position:        "relative",
                          width:           "clamp(120px, 20vw, 200px)",
                          height:          "clamp(120px, 20vw, 200px)",
                          borderRadius:    "9999px",
                          border:          "1px solid rgba(133,92,157,0.3)",
                          backgroundColor: "#110c18",
                          display:         "flex",
                          alignItems:      "center",
                          justifyContent:  "center",
                          overflow:        "hidden",
                        }}
                      >
                        {client.avatar_url ? (
                          <Image src={client.avatar_url} alt={client.name} fill className="object-cover rounded-full" />
                        ) : (
                          <span style={{ fontFamily: "Inter, sans-serif", color: "rgba(133,92,157,0.6)", fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                            {client.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Name + Role */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span
                          style={{
                            fontFamily:   "Inter, sans-serif",
                            fontWeight:   400,
                            fontSize:     "clamp(0.72rem, 0.95vw, 1.2rem)",
                            color:        "#f5f3f7",
                            whiteSpace:   "nowrap",
                            textAlign:    "center",
                            marginBottom: "0.1rem",
                          }}
                        >
                          {client.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "source-serif-pro, serif",
                            fontStyle:  "italic",
                            fontWeight: 900,
                            fontSize:   "clamp(0.72rem, 0.95vw, 1rem)",
                            color:      "#855c9d",
                            whiteSpace: "nowrap",
                            textAlign:  "center",
                          }}
                        >
                          {client.role}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
