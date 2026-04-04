import type React from "react";
import NavInteractive from "./NavInteractive";

const linkStyle: React.CSSProperties = {
  fontFamily:    "neue-haas-grotesk-display, Inter, sans-serif",
  fontSize:      "clamp(0.72rem, 1vw, 0.82rem)",
  fontWeight:    500,
  letterSpacing: "0.04em",
  color:         "rgba(245,243,247,0.55)",
  textDecoration: "none",
  transition:    "color 0.2s",
};

export default function Nav() {
  return (
    <NavInteractive>
      <a href="/#services" style={linkStyle} className="nav-link">services</a>
      <a href="/#portfolio" style={linkStyle} className="nav-link">portfolio</a>
      <a href="/#about" style={linkStyle} className="nav-link">à propos</a>
      <a href="/blog" style={linkStyle} className="nav-link">blog</a>
      <style>{`.nav-link:hover { color: #f5f3f7 !important; }`}</style>
    </NavInteractive>
  );
}
