"use client";

import { useI18n } from "@/lib/i18n";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/saint_walano",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/walanodesign",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/saint_walano",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/walanodesign",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://behance.net/walanodesign",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.513-1.914-5.513-5.517 0-3.612 2.247-5.879 5.353-5.879 3.121 0 4.851 1.667 5.305 4.091.133.671.208 1.37.208 2.305h-8.2c.106 2.099 1.466 2.765 2.821 2.765 1.218 0 1.965-.577 2.265-1.765h2.862zm-5.394-3.4c-.106-1.429-.933-2.1-1.96-2.1-.979 0-1.839.624-2.021 2.1h3.981zm-10.332 3.4H2V5h6.182c2.069 0 3.428 1.026 3.428 2.775 0 1.225-.611 2.071-1.695 2.507.997.328 1.855 1.156 1.855 2.607 0 2.019-1.389 3.111-3.776 3.111zM6.113 10.08h-.613V6.68h.613c1.172 0 1.945.443 1.945 1.697 0 1.253-.773 1.703-1.945 1.703zm.174 5.32h-.787v-3.724h.787c1.412 0 2.196.635 2.196 1.862 0 1.227-.784 1.862-2.196 1.862z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@saint_walano",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer
      style={{
        position:        "relative",
        width:           "100%",
        backgroundColor: "#855c9d",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        paddingTop:      "clamp(2.5rem, 5vw, 4rem)",
        gap:             "1rem",
      }}
    >
      {/* Email */}
      <a
        href="mailto:contact@walanodesign.com"
        style={{
          fontFamily:     "Inter, sans-serif",
          fontWeight:     400,
          fontSize:       "clamp(0.85rem, 2vw, 0.95rem)",
          color:          "#0c0c0c",
          textDecoration: "none",
          letterSpacing:  "0.02em",
          transition:     "color 0.25s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0c0c0c")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0c0c0c")}
      >
        contact@walanodesign.com
      </a>

      {/* Social icons */}
      <div style={{
        display:        "flex",
        flexWrap:       "wrap",
        justifyContent: "center",
        alignItems:     "center",
        gap:            "clamp(1.2rem, 4vw, 2rem)",
        paddingInline:  "2rem",
      }}>
        {SOCIALS.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              color:      "#0c0c0c",
              transition: "color 0.25s",
              display:    "flex",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0c0c0c")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0c0c0c")}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Large wordmark */}
      <div
        style={{
          width:          "100%",
          display:        "flex",
          justifyContent: "center",
          alignItems:     "center",
          paddingTop:     "0.5rem",
          paddingBottom:  "0.25rem",
          userSelect:     "none",
          pointerEvents:  "none",
          overflow:       "hidden",
        }}
        aria-hidden
      >
        <span
          style={{
            fontFamily: "austin-pen, cursive",
            fontSize:   "clamp(3rem, 13vw, 14rem)",
            color:      "#0c0c0c",
            whiteSpace: "nowrap",
            lineHeight: 1.1,
            display:    "block",
          }}
        >
          walano des<span style={{ marginRight: "-0.05em" }}>i</span>gn
        </span>
      </div>

      {/* Legal links + copyright bar */}
      <div
        style={{
          width:         "100%",
          paddingInline: "clamp(1rem, 5vw, 3rem)",
          paddingBottom: "1.5rem",
        }}
      >
        <style>{`
          .footer-legal { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
          @media (min-width: 768px) { .footer-legal { flex-direction: row; justify-content: center; gap: 0; } }
          .footer-legal-sep { display: none; }
          @media (min-width: 768px) { .footer-legal-sep { display: inline; color: rgba(12,12,12,0.35); padding: 0 1.25rem; } }
        `}</style>
        <div className="footer-legal">
          {[
            { label: "Conditions générales de vente", href: "/conditions" },
            { label: "Politique de confidentialité",  href: "/confidentialite" },
            { label: "Mentions légales",              href: "/mentions-legales" },
          ].map(({ label, href }, i) => (
            <span key={href} style={{ display: "contents" }}>
              {i > 0 && <span className="footer-legal-sep" aria-hidden>·</span>}
              <a
                href={href}
                style={{
                  fontFamily:     "Inter, sans-serif",
                  fontWeight:     400,
                  fontSize:       "clamp(0.72rem, 1.2vw, 0.78rem)",
                  color:          "rgba(12,12,12,0.6)",
                  textDecoration: "none",
                  transition:     "color 0.2s",
                  whiteSpace:     "nowrap",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#0c0c0c")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(12,12,12,0.6)")}
              >
                {label}
              </a>
            </span>
          ))}
          <span className="footer-legal-sep" aria-hidden>·</span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize:   "clamp(0.72rem, 1.2vw, 0.78rem)",
              color:      "rgba(12,12,12,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            © 2026 walano design. all rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
