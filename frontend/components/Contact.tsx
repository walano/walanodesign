"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { sendContact } from "@/lib/api";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/saint_walano" },
  { label: "Behance",   href: "https://behance.net/walanodesign"    },
  { label: "TikTok",    href: "https://tiktok.com/@saint_walano"    },
  { label: "X",         href: "https://x.com/saint_walano"          },
];

const inputStyle: React.CSSProperties = {
  width:           "100%",
  background:      "rgba(255,255,255,0.05)",
  border:          "none",
  outline:         "1px solid rgba(255,255,255,0.15)",
  color:           "#f5f3f7",
  fontFamily:      "Inter, sans-serif",
  fontSize:        "clamp(0.8rem, 1vw, 0.875rem)",
  padding:         "0.9rem 1rem",
  boxSizing:       "border-box" as const,
  transition:      "outline-color 0.2s",
};

export default function Contact() {
  const { t } = useI18n();

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");

  const valid = name.trim() && email.includes("@") && subject.trim() && message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "loading") return;
    setStatus("loading");
    try {
      await sendContact({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
      setStatus("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        minHeight:     "100vh",
        background:    "#0c0c0c",
        paddingTop:    "clamp(5rem, 10vw, 8rem)",
        paddingBottom: "clamp(4rem, 8vw, 6rem)",
        paddingInline: "clamp(1.2rem, 4vw, 3rem)",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <style>{`
        .wd-ci:focus { outline-color: rgba(133,92,157,0.6) !important; }
        .wd-contact-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(3rem, 6vw, 6rem);
          margin-top: 0.5rem;
        }
        @media (min-width: 768px) {
          .wd-contact-cols { grid-template-columns: 1fr 1.8fr; align-items: start; }
        }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <p style={{
          fontFamily:    "Inter, sans-serif",
          fontWeight:    600,
          fontSize:      "clamp(0.68rem, 0.85vw, 0.78rem)",
          letterSpacing: "0.12em",
          color:         "rgba(133,92,157,0.8)",
          margin:        "0 0 0.75rem",
        }}>
          {t("contact.title")}
        </p>
        <h1 style={{
          fontFamily:    "Inter, sans-serif",
          fontWeight:    300,
          fontSize:      "clamp(2rem, 5vw, 4.5rem)",
          color:         "#f5f3f7",
          lineHeight:    1.05,
          letterSpacing: "-0.04em",
          margin:        0,
        }}>
          {t("contact.label_before")}
          <em style={{
            fontFamily:  "source-serif-pro, serif",
            fontStyle:   "italic",
            fontWeight:  900,
            fontSize:    "115%",
            letterSpacing: "-0.04em",
            color:       "#855c9d",
          }}>{t("contact.label_em")}</em>
          {t("contact.label_after")}
        </h1>
      </div>

      <div className="wd-contact-cols">

        {/* ── Left — info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "clamp(0.82rem, 1vw, 0.92rem)",
            color:      "rgba(245,243,247,0.45)",
            lineHeight: 1.75,
            margin:     0,
          }}>
            {t("contact.sub")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(245,243,247,0.3)", margin: 0 }}>
              email
            </p>
            <a
              href="mailto:contact@walanodesign.com"
              style={{
                fontFamily:     "Inter, sans-serif",
                fontSize:       "clamp(0.82rem, 1vw, 0.9rem)",
                color:          "#f5f3f7",
                textDecoration: "none",
                transition:     "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#855c9d")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f3f7")}
            >
              contact@walanodesign.com
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(245,243,247,0.3)", margin: 0 }}>
              socials
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily:     "Inter, sans-serif",
                    fontSize:       "clamp(0.8rem, 1vw, 0.88rem)",
                    color:          "rgba(245,243,247,0.55)",
                    textDecoration: "none",
                    transition:     "color 0.2s",
                    width:          "fit-content",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f3f7")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,247,0.55)")}
                >
                  {label.toLowerCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right — form ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <input
              className="wd-ci"
              style={inputStyle}
              type="text"
              placeholder={t("contact.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
            <input
              className="wd-ci"
              style={inputStyle}
              type="email"
              placeholder={t("contact.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          <input
            className="wd-ci"
            style={inputStyle}
            type="text"
            placeholder={t("contact.subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />

          <textarea
            className="wd-ci"
            style={{ ...inputStyle, minHeight: 180, resize: "vertical" }}
            placeholder={t("contact.message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />

          {status === "success" && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(133,92,157,0.9)", margin: 0, lineHeight: 1.6 }}>
              {t("contact.success")}
            </p>
          )}

          {status === "error" && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(192,57,43,0.85)", margin: 0, lineHeight: 1.6 }}>
              {t("contact.error")}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={!valid || status === "loading" || status === "success"}
              style={{
                background:           (!valid || status === "loading" || status === "success")
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(133,92,157,0.3)",
                backdropFilter:       "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                outline:              `1px solid ${(!valid || status === "loading" || status === "success")
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(133,92,157,0.5)"}`,
                border:        "none",
                color:         (!valid || status === "loading" || status === "success")
                  ? "rgba(245,243,247,0.3)"
                  : "#f5f3f7",
                fontFamily:    "Inter, sans-serif",
                fontWeight:    600,
                fontSize:      "clamp(0.72rem, 0.95vw, 0.85rem)",
                letterSpacing: "0.04em",
                padding:       "0.75rem 2rem",
                cursor:        (!valid || status === "loading" || status === "success") ? "not-allowed" : "pointer",
                transition:    "all 0.2s",
              }}
            >
              {status === "loading" ? t("contact.sending") : t("contact.send")}
            </button>

            <a
              href="/"
              style={{
                fontFamily:     "Inter, sans-serif",
                fontSize:       "0.78rem",
                color:          "rgba(245,243,247,0.3)",
                textDecoration: "none",
                letterSpacing:  "0.04em",
                transition:     "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245,243,247,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,243,247,0.3)")}
            >
              home
            </a>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
