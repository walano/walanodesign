"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      minHeight:      "100vh",
      background:     "#0c0c0c",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            "1.5rem",
      padding:        "2rem",
      textAlign:      "center",
    }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.12em", color: "rgba(133,92,157,0.8)", margin: 0 }}>
        une erreur est survenue
      </p>

      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "#f5f3f7", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
        quelque chose s&apos;est mal passé.
      </h1>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(245,243,247,0.4)", lineHeight: 1.7, margin: 0, maxWidth: 400 }}>
        la page a rencontré un problème inattendu. réessayez ou revenez à l&apos;accueil.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    600,
            fontSize:      "0.78rem",
            letterSpacing: "0.04em",
            padding:       "0.7rem 1.6rem",
            background:    "rgba(133,92,157,0.3)",
            border:        "1px solid rgba(133,92,157,0.5)",
            color:         "#f5f3f7",
            cursor:        "pointer",
          }}
        >
          réessayer
        </button>
        <a
          href="/"
          style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    600,
            fontSize:      "0.78rem",
            letterSpacing: "0.04em",
            padding:       "0.7rem 1.6rem",
            background:    "rgba(255,255,255,0.08)",
            border:        "1px solid rgba(255,255,255,0.18)",
            color:         "#f5f3f7",
            textDecoration:"none",
          }}
        >
          accueil
        </a>
      </div>
    </div>
  );
}
