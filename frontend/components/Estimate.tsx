"use client";

import { useEffect, useRef, useState } from "react";
import { submitDevis, type DevisResult } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

// ─── Light theme tokens ────────────────────────────────────────────────────────
const C = {
  accent:       "#855c9d",
  accentBg:     "rgba(133,92,157,0.1)",
  accentBorder: "rgba(133,92,157,0.35)",

  cardBg:       "#f5f3f7",
  leftBg:       "#ede8f2",
  leftBorder:   "rgba(133,92,157,0.18)",

  text:         "#0c0c0c",
  textMid:      "rgba(12,12,12,0.55)",
  textDim:      "rgba(12,12,12,0.35)",

  btnBg:        "rgba(255,255,255,0.75)",
  btnBorder:    "rgba(133,92,157,0.2)",
  btnSelBg:     "rgba(133,92,157,0.12)",
  btnSelBorder: "#855c9d",

  innerBg:      "rgba(0,0,0,0.04)",
  innerBorder:  "rgba(0,0,0,0.08)",

  inputBg:      "#ffffff",
  inputBorder:  "rgba(133,92,157,0.25)",
};

// ─── Bilingual copy ────────────────────────────────────────────────────────────
const COPY = {
  fr: {
    stepMeta: {
      category:       { title: "quel est votre projet ?",        sub: "sélectionnez la catégorie qui correspond à votre besoin." },
      subtype:        { title: "précisez votre projet",          sub: "choisissez l'option qui correspond le mieux à ce que vous recherchez." },
      video_duration: { title: "durée de la vidéo ?",            sub: "cela nous permet d'estimer au plus juste." },
      extra:          { title: "parlez-nous de votre projet",    sub: "style, univers, références, date de sortie… plus vous partagez, plus la proposition sera personnalisée." },
      deadline:       { title: "quel est votre délai ?",         sub: "le délai influence le prix final. soyez transparent, on s'adapte." },
      currency:       { title: "dans quelle devise ?",           sub: "choisissez la devise dans laquelle vous souhaitez être facturé." },
      budget:         { title: "combien êtes-vous capable d'investir pour la réalisation de votre projet ?" },
      contact:        { title: "vos coordonnées",                sub: "pour recevoir votre devis personnalisé." },
    },
    categories: [
      { id: "covers",     label: "covers",              sub: "single, album, 3d" },
      { id: "branding",   label: "logo & branding",     sub: "logo, identité visuelle" },
      { id: "videos",     label: "lyrics video",        sub: "2d, cinématique, 3d" },
      { id: "affiches",   label: "affiches",            sub: "événement, pack, compilation" },
      { id: "miniatures", label: "miniatures youtube",  sub: "unique, pack, rebranding" },
      { id: "bannieres",  label: "bannières & profils", sub: "x, twitch, youtube" },
    ],
    subtypes: {
      covers: [
        { id: "single",    label: "cover single",    desc: "pour un single musical" },
        { id: "album",     label: "cover album",     desc: "pochette d'album complète" },
        { id: "single_3d", label: "cover single 3d", desc: "rendu 3d premium", badge: "3d" },
        { id: "album_3d",  label: "cover album 3d",  desc: "pochette album en 3d", badge: "3d" },
      ],
      branding: [
        { id: "logo",    label: "logo simple",      desc: "un logo propre et professionnel" },
        { id: "mini",    label: "mini branding",    desc: "logo + couleurs + polices + vision (1 page)" },
        { id: "complet", label: "branding complet", desc: "identité visuelle complète avec charte" },
        { id: "premium", label: "branding premium", desc: "stratégie de marque + identité + supports", badge: "premium" },
      ],
      videos: [
        { id: "simple",      label: "typographie & arrière-plan", desc: "texte animé sur fond statique" },
        { id: "bg_anime",    label: "background animé",           desc: "fond animé + typographies" },
        { id: "lyric_card",  label: "lyric card style",           desc: "images fixes par ligne" },
        { id: "minimaliste", label: "minimaliste animé",          desc: "épuré, transitions fluides" },
        { id: "cinematique", label: "cinématique",                desc: "footage vidéo + overlay texte" },
        { id: "glitch",      label: "particle / glitch",          desc: "effets visuels stylisés" },
        { id: "3d",          label: "3d",                         desc: "animation 3d complète" },
      ],
      affiches: [
        { id: "unique",      label: "affiche unique",    desc: "un seul visuel événementiel" },
        { id: "pack",        label: "pack événement",    desc: "plusieurs visuels pour un événement" },
        { id: "compilation", label: "compilation",       desc: "série de visuels thématiques" },
        { id: "entreprise",  label: "projet entreprise", desc: "long terme, volume important", badge: "sur devis" },
      ],
      miniatures: [
        { id: "unique",     label: "miniature unique",      desc: "pour une vidéo spécifique" },
        { id: "pack",       label: "pack miniatures",       desc: "plusieurs vidéos, tarif dégressif" },
        { id: "rebranding", label: "rebranding miniatures", desc: "refonte de tout votre catalogue", badge: "sur devis" },
      ],
      bannieres: [
        { id: "banniere",   label: "bannière seule",     desc: "header de chaîne / page" },
        { id: "profil",     label: "photo de profil",    desc: "avatar professionnel" },
        { id: "both",       label: "bannière + profil",  desc: "pack complet réseaux" },
        { id: "rebranding", label: "rebranding de page", desc: "refonte visuelle complète", badge: "sur devis" },
      ],
    } as Record<string, { id: string; label: string; desc: string; badge?: string }[]>,
    videoDurations: [
      { id: "short",  label: "moins de 2 min" },
      { id: "medium", label: "2 à 4 min" },
      { id: "long",   label: "4 à 6 min" },
      { id: "xlong",  label: "plus de 6 min", badge: "sur devis" },
    ],
    deadlines: [
      { id: "urgent",   label: "rush",     sub: "5 à 10 jours",       surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "rapide",   sub: "10 à 14 jours",      surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "normal",   sub: "2 à 4 semaines",     surcharge: 0,  color: C.accent },
      { id: "flexible", label: "flexible", sub: "pas de date précise", surcharge: 0,  color: C.textMid },
    ],
    deadlines3d: [
      { id: "urgent",   label: "rush",     sub: "10 à 14 jours",      surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "rapide",   sub: "2 à 3 semaines",     surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "normal",   sub: "3 à 5 semaines",     surcharge: 0,  color: C.accent },
      { id: "flexible", label: "flexible", sub: "pas de date précise", surcharge: 0,  color: C.textMid },
    ],
    onQuote: "sur devis",
    standard: "standard",
    navBack: "retour",
    navNext: "continuer",
    navSubmit: "obtenir mon estimation",
    navReset: "nouvelle estimation",
    navHome: "retour à l'accueil",
    extraHint: "optionnel, mais ça change tout.",
    extraPlaceholders: {
      covers:     "ex: je sors un ep afrobeats en mars, je veux quelque chose de premium et cinématique…",
      branding:   "ex: je lance une marque de streetwear urban, cible 18-30 ans, bold et moderne…",
      videos:     "ex: clip sombre et atmosphérique, trap mélancolique, visuels urbains la nuit…",
      default:    "ex: décrivez votre projet, votre univers visuel, vos références…",
    },
    contactName:  "votre prénom",
    contactEmail: "votre email",
    step: "étape",
    of:   "sur",
    result: {
      title:          "votre estimation",
      subtitle:       "préparée par walano design",
      loading1:       "walano analyse votre projet…",
      loading2:       "préparation de votre pack personnalisé",
      error:          "une erreur est survenue. veuillez réessayer.",
      proposal:       "ce qu'on vous propose",
      urgencySurge:   "supplément urgence +30% inclus",
      fastSurge:      "supplément délai rapide +15% inclus",
      goFurther:      "pour aller plus loin",
      sentTo:         "envoyé à",
    },
  },

  en: {
    stepMeta: {
      category:       { title: "what's your project?",              sub: "select the category that matches your need." },
      subtype:        { title: "specify your project",              sub: "choose the option that best matches what you're looking for." },
      video_duration: { title: "video duration?",                   sub: "this helps us give you the most accurate estimate." },
      extra:          { title: "tell us about your project",        sub: "style, universe, references, release date… the more you share, the more personalized the proposal." },
      deadline:       { title: "what's your deadline?",             sub: "the deadline affects the final price. be transparent, we'll adapt." },
      currency:       { title: "in which currency?",                sub: "choose the currency you wish to be invoiced in." },
      budget:         { title: "how much are you willing to invest for your project?" },
      contact:        { title: "your details",                      sub: "to receive your personalized quote." },
    },
    categories: [
      { id: "covers",     label: "covers",              sub: "single, album, 3d" },
      { id: "branding",   label: "logo & branding",     sub: "logo, visual identity" },
      { id: "videos",     label: "lyrics video",        sub: "2d, cinematic, 3d" },
      { id: "affiches",   label: "posters",             sub: "event, pack, compilation" },
      { id: "miniatures", label: "youtube thumbnails",  sub: "unique, pack, rebrand" },
      { id: "bannieres",  label: "banners & profiles",  sub: "x, twitch, youtube" },
    ],
    subtypes: {
      covers: [
        { id: "single",    label: "single cover",    desc: "for a music single" },
        { id: "album",     label: "album cover",     desc: "full album artwork" },
        { id: "single_3d", label: "3d single cover", desc: "premium 3d render", badge: "3d" },
        { id: "album_3d",  label: "3d album cover",  desc: "album artwork in 3d", badge: "3d" },
      ],
      branding: [
        { id: "logo",    label: "simple logo",      desc: "a clean and professional logo" },
        { id: "mini",    label: "mini branding",    desc: "logo + colors + fonts + vision (1 page)" },
        { id: "complet", label: "full branding",    desc: "complete visual identity with brand guidelines" },
        { id: "premium", label: "premium branding", desc: "brand strategy + identity + assets", badge: "premium" },
      ],
      videos: [
        { id: "simple",      label: "typography & background", desc: "animated text on static background" },
        { id: "bg_anime",    label: "animated background",     desc: "animated bg + typography" },
        { id: "lyric_card",  label: "lyric card style",        desc: "fixed images per line" },
        { id: "minimaliste", label: "minimalist animated",     desc: "clean, smooth transitions" },
        { id: "cinematique", label: "cinematic",               desc: "video footage + text overlay" },
        { id: "glitch",      label: "particle / glitch",       desc: "stylized visual effects" },
        { id: "3d",          label: "3d",                      desc: "full 3d animation" },
      ],
      affiches: [
        { id: "unique",      label: "single poster",   desc: "one event visual" },
        { id: "pack",        label: "event pack",      desc: "multiple visuals for an event" },
        { id: "compilation", label: "compilation",     desc: "series of themed visuals" },
        { id: "entreprise",  label: "business project",desc: "long term, high volume", badge: "on quote" },
      ],
      miniatures: [
        { id: "unique",     label: "single thumbnail",    desc: "for a specific video" },
        { id: "pack",       label: "thumbnail pack",      desc: "multiple videos, volume pricing" },
        { id: "rebranding", label: "thumbnail rebrand",   desc: "full catalog overhaul", badge: "on quote" },
      ],
      bannieres: [
        { id: "banniere",   label: "banner only",     desc: "channel / page header" },
        { id: "profil",     label: "profile picture", desc: "professional avatar" },
        { id: "both",       label: "banner + profile", desc: "complete social pack" },
        { id: "rebranding", label: "page rebrand",    desc: "full visual overhaul", badge: "on quote" },
      ],
    } as Record<string, { id: string; label: string; desc: string; badge?: string }[]>,
    videoDurations: [
      { id: "short",  label: "less than 2 min" },
      { id: "medium", label: "2 to 4 min" },
      { id: "long",   label: "4 to 6 min" },
      { id: "xlong",  label: "more than 6 min", badge: "on quote" },
    ],
    deadlines: [
      { id: "urgent",   label: "rush",     sub: "5 to 10 days",      surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "fast",     sub: "10 to 14 days",     surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "standard", sub: "2 to 4 weeks",      surcharge: 0,  color: C.accent },
      { id: "flexible", label: "flexible", sub: "no specific date",  surcharge: 0,  color: C.textMid },
    ],
    deadlines3d: [
      { id: "urgent",   label: "rush",     sub: "10 to 14 days",     surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "fast",     sub: "2 to 3 weeks",      surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "standard", sub: "3 to 5 weeks",      surcharge: 0,  color: C.accent },
      { id: "flexible", label: "flexible", sub: "no specific date",  surcharge: 0,  color: C.textMid },
    ],
    onQuote: "on quote",
    standard: "standard",
    navBack: "back",
    navNext: "continue",
    navSubmit: "get my estimate",
    navReset: "new estimate",
    navHome: "back to home",
    extraHint: "optional, but it changes everything.",
    extraPlaceholders: {
      covers:   "e.g. i'm releasing an afrobeats ep in march, i want something premium and cinematic…",
      branding: "e.g. i'm launching an urban streetwear brand, targeting 18-30, bold and modern…",
      videos:   "e.g. dark and atmospheric clip, melancholic trap, urban night visuals…",
      default:  "e.g. describe your project, visual universe, references…",
    },
    contactName:  "your first name",
    contactEmail: "your email",
    step: "step",
    of:   "of",
    result: {
      title:          "your estimate",
      subtitle:       "prepared by walano design",
      loading1:       "walano is analyzing your project…",
      loading2:       "preparing your personalized package",
      error:          "an error occurred. please try again.",
      proposal:       "our proposal",
      urgencySurge:   "urgency surcharge +30% included",
      fastSurge:      "fast deadline surcharge +15% included",
      goFurther:      "go further",
      sentTo:         "sent to",
    },
  },
};

// ─── Currency / budget data (labels stay numeric, language-agnostic) ───────────
const CURRENCIES = [
  { id: "FCFA", label: "franc cfa",  sub_fr: "français",           sub_en: "french",             symbol: "XAF/XOF" },
  { id: "EUR",  label: "euro (€)",   sub_fr: "français / english", sub_en: "français / english",  symbol: "EUR" },
  { id: "USD",  label: "dollar ($)", sub_fr: "english",            sub_en: "english",             symbol: "USD" },
];

function getBudgets(currency: string, lang: string): { id: string; label: string }[] {
  const fr = lang === "fr";
  if (currency === "FCFA") return [
    { id: "b1", label: fr ? "moins de 50.000 fcfa"        : "less than 50,000 fcfa" },
    { id: "b2", label: "50.000 – 150.000 fcfa" },
    { id: "b3", label: "150.000 – 300.000 fcfa" },
    { id: "b4", label: "300.000 – 500.000 fcfa" },
    { id: "b5", label: fr ? "500.000 fcfa et plus"        : "500,000 fcfa and above" },
  ];
  if (currency === "EUR") return [
    { id: "b1", label: fr ? "moins de 80€"   : "less than 80€" },
    { id: "b2", label: "80€ – 250€" },
    { id: "b3", label: "250€ – 500€" },
    { id: "b4", label: "500€ – 800€" },
    { id: "b5", label: fr ? "800€ et plus"   : "800€ and above" },
  ];
  return [
    { id: "b1", label: fr ? "moins de 90$"   : "less than $90" },
    { id: "b2", label: "$90 – $270" },
    { id: "b3", label: "$270 – $540" },
    { id: "b4", label: "$540 – $850" },
    { id: "b5", label: fr ? "850$ et plus"   : "$850 and above" },
  ];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getSteps(category: string | null) {
  if (category === "videos")
    return ["category", "subtype", "video_duration", "extra", "deadline", "currency", "budget", "contact", "result"];
  return ["category", "subtype", "extra", "deadline", "currency", "budget", "contact", "result"];
}

// ─── UI components ─────────────────────────────────────────────────────────────
function SelectCard({ item, selected, onClick, onQuote }: {
  item: { label: string; desc?: string; badge?: string };
  selected: boolean;
  onClick: () => void;
  onQuote: string;
}) {
  return (
    <button onClick={onClick} style={{
      background:  selected ? C.btnSelBg : C.btnBg,
      border:      `1px solid ${selected ? C.btnSelBorder : C.btnBorder}`,
      backdropFilter: "blur(10px)",
      padding: "12px 14px", cursor: "pointer",
      textAlign: "left", transition: "all 0.2s", width: "100%",
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
    }}>
      <div>
        <div style={{ color: selected ? C.accent : C.text, fontSize: 13, fontWeight: 600, marginBottom: item.desc ? 2 : 0, fontFamily: "Inter, sans-serif" }}>{item.label}</div>
        {item.desc && <div style={{ color: C.textDim, fontSize: 12, fontFamily: "Inter, sans-serif" }}>{item.desc}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {item.badge && (
          <span style={{
            background: item.badge === onQuote ? C.accentBg : C.accent,
            color:       item.badge === onQuote ? C.accent : "#fff",
            fontSize: 10, fontWeight: 700, padding: "2px 8px",
            fontFamily: "Inter, sans-serif", letterSpacing: "0.04em",
          }}>{item.badge}</span>
        )}
        {selected && <div style={{ width: 6, height: 6, background: C.accent }} />}
      </div>
    </button>
  );
}

function NavButtons({ onBack, onNext, nextLabel, backLabel, disabled }: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  backLabel: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
      {onBack && (
        <button onClick={onBack} style={{
          flex: 1, background: C.btnBg, border: `1px solid ${C.btnBorder}`,
          color: C.textMid, padding: 13, cursor: "pointer",
          fontSize: 13, fontFamily: "Inter, sans-serif",
        }}>{backLabel}</button>
      )}
      <button onClick={onNext} disabled={disabled} style={{
        flex: 2,
        background: disabled ? C.innerBg : C.accent,
        color:      disabled ? C.textDim : "#fff",
        border:     `1px solid ${disabled ? C.innerBorder : C.accent}`,
        padding: 13, cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif", transition: "all 0.2s",
      }}>{nextLabel}</button>
    </div>
  );
}

// ─── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ state, onReset, copy }: {
  state: FormState;
  onReset: () => void;
  copy: typeof COPY["fr"];
}) {
  const [result, setResult]   = useState<DevisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    submitDevis({
      category:      state.category!,
      subtype:       state.subtype!,
      videoDuration: state.videoDuration || undefined,
      extra:         state.extra,
      deadline:      state.deadline!,
      currency:      state.currency!,
      budget:        state.budget!,
      name:          state.name,
      email:         state.email,
      lang:          state.lang,
    })
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const r = copy.result;
  const isUrgent = state.deadline === "urgent" || state.deadline === "rapide";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ marginBottom: 4 }}>
        <h3 style={{ color: C.text, fontSize: 18, fontWeight: 600, margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>{r.title}</h3>
        <p style={{ color: C.textDim, fontSize: 12, margin: 0, fontFamily: "Inter, sans-serif" }}>{r.subtitle}</p>
      </div>

      {loading && (
        <div style={{ background: C.innerBg, border: `1px solid ${C.innerBorder}`, padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 24, color: C.accent, marginBottom: 10, animation: "wdPulse 1.4s ease infinite" }}>◌</div>
          <div style={{ color: C.textMid, fontSize: 14, fontFamily: "Inter, sans-serif" }}>{r.loading1}</div>
          <div style={{ color: C.textDim, fontSize: 12, marginTop: 6, fontFamily: "Inter, sans-serif" }}>{r.loading2}</div>
        </div>
      )}

      {error && (
        <div style={{ background: C.innerBg, border: `1px solid ${C.innerBorder}`, padding: 24, color: C.textMid, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
          {r.error}
        </div>
      )}

      {result && !loading && (
        <>
          <div>
            <span style={{ background: C.accent, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", letterSpacing: "0.04em", fontFamily: "Inter, sans-serif" }}>
              {result.packName.toLowerCase()}
            </span>
          </div>

          <div style={{ background: C.accentBg, border: `1px solid ${C.accentBorder}`, padding: 20 }}>
            <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>{r.proposal}</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 4, fontFamily: "Inter, sans-serif" }}>{result.offerTitle.toLowerCase()}</div>
            <div style={{ color: C.accent, fontSize: 26, fontWeight: 800, letterSpacing: "-0.05em", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>{result.price}</div>
            <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7, margin: 0, fontFamily: "Inter, sans-serif" }}>{result.offerDetails}</p>
          </div>

          {isUrgent && (
            <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", padding: "10px 14px" }}>
              <div style={{ color: "#c0392b", fontSize: 12, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                {state.deadline === "urgent" ? r.urgencySurge : r.fastSurge}
              </div>
            </div>
          )}

          <div style={{ background: C.innerBg, border: `1px solid ${C.innerBorder}`, padding: 20 }}>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", fontFamily: "Inter, sans-serif" }}>{result.message}</p>
          </div>

          {result.upsell && (
            <div style={{ border: `1px dashed ${C.accentBorder}`, padding: 18 }}>
              <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>{r.goFurther}</div>
              <p style={{ color: C.textMid, fontSize: 13, margin: 0, lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>{result.upsell}</p>
            </div>
          )}
        </>
      )}

      <div style={{ background: C.innerBg, border: `1px solid ${C.innerBorder}`, padding: "11px 15px", display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span style={{ color: C.textDim, fontFamily: "Inter, sans-serif" }}>{r.sentTo}</span>
        <span style={{ color: C.text, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>{state.name} · {state.email}</span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <a href="/" style={{
          flex: 1, background: C.btnBg, border: `1px solid ${C.btnBorder}`,
          color: C.textMid, padding: 13, cursor: "pointer",
          fontFamily: "Inter, sans-serif", fontSize: 13,
          textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
        }}>{copy.navHome}</a>
        <button onClick={onReset} style={{
          flex: 1, background: C.accent, border: `1px solid ${C.accent}`,
          color: "#fff", padding: 13, cursor: "pointer",
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
        }}>{copy.navReset}</button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
interface FormState {
  category:      string | null;
  subtype:       string | null;
  videoDuration: string | null;
  extra:         string;
  deadline:      string | null;
  currency:      string | null;
  budget:        string | null;
  name:          string;
  email:         string;
  lang:          string;
}

const INITIAL_STATE: FormState = {
  category: null, subtype: null, videoDuration: null,
  extra: "", deadline: null, currency: null, budget: null, name: "", email: "", lang: "fr",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: C.inputBg,
  border: `1px solid ${C.inputBorder}`,
  padding: "13px 16px",
  color: C.text,
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function Estimate() {
  const { lang } = useI18n();
  const copy     = COPY[lang] ?? COPY.fr;
  const cardRef  = useRef<HTMLDivElement>(null);

  const [state, setState]         = useState<FormState>({ ...INITIAL_STATE, lang });
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone]           = useState(false);

  const set = (k: keyof FormState, v: string | null) =>
    setState(s => ({ ...s, [k]: v }));

  const steps       = getSteps(state.category);
  const currentStep = steps[stepIndex];
  const totalSteps  = steps.length;
  const isLastBeforeResult = stepIndex === totalSteps - 2;

  const canNext = (): boolean => {
    if (currentStep === "category")       return !!state.category;
    if (currentStep === "subtype")        return !!state.subtype;
    if (currentStep === "video_duration") return !!state.videoDuration;
    if (currentStep === "extra")          return true;
    if (currentStep === "deadline")       return !!state.deadline;
    if (currentStep === "currency")       return !!state.currency;
    if (currentStep === "budget")         return !!state.budget;
    if (currentStep === "contact")        return state.name.trim().length > 0 && state.email.includes("@");
    return true;
  };

  const goNext = () => { if (isLastBeforeResult) { setDone(true); return; } setStepIndex(i => i + 1); };
  const goBack = () => setStepIndex(i => i - 1);
  const handleReset = () => { setDone(false); setStepIndex(0); setState(INITIAL_STATE); };

  const stepMeta = copy.stepMeta[currentStep as keyof typeof copy.stepMeta] || { title: "" };

  const extraPlaceholder =
    state.category === "covers"   ? copy.extraPlaceholders.covers
    : state.category === "branding" ? copy.extraPlaceholders.branding
    : state.category === "videos"   ? copy.extraPlaceholders.videos
    : copy.extraPlaceholders.default;

  const activeDeadlines = state.subtype === "album_3d"
    ? copy.deadlines3d
    : copy.deadlines;

  return (
    <>
      <style>{`
        @keyframes wdPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .wd-input:focus { border-color: ${C.accent} !important; }
        textarea.wd-input { resize: vertical; }
        .wd-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 500px;
          background: ${C.cardBg};
          border: 1px solid ${C.leftBorder};
        }
        @media (min-width: 700px) {
          .wd-card {
            flex-direction: row;
            max-width: 820px;
            min-height: 520px;
          }
        }
        .wd-left {
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid ${C.leftBorder};
          background: ${C.leftBg};
        }
        @media (min-width: 700px) {
          .wd-left {
            width: 280px;
            flex-shrink: 0;
            border-bottom: none;
            border-right: 1px solid ${C.leftBorder};
            justify-content: space-between;
          }
        }
        .wd-right {
          padding: 28px 26px 30px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .wd-full {
          padding: 28px 26px 30px;
          flex: 1;
        }
      `}</style>

      <div ref={cardRef} className="wd-card">

        {/* ── Left panel ── */}
        {!done && (
          <div className="wd-left">
            <div>
              {/* Progress bar */}
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                  <div key={i} style={{
                    height: 2,
                    flex: i < stepIndex + 1 ? 2 : 1,
                    background: i < stepIndex + 1 ? C.accent : C.inputBorder,
                    transition: "all 0.4s ease",
                  }} />
                ))}
              </div>

              <p style={{ color: C.textDim, fontSize: 11, margin: "0 0 24px", fontFamily: "Inter, sans-serif" }}>
                {copy.step} {stepIndex + 1} {copy.of} {totalSteps - 1}
              </p>

              <h2 style={{
                color: C.text, fontSize: 15, fontWeight: 600,
                margin: "0 0 10px", fontFamily: "Inter, sans-serif",
                lineHeight: 1.45, letterSpacing: "-0.01em",
              }}>{stepMeta.title}</h2>

              {"sub" in stepMeta && stepMeta.sub && (
                <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.65, fontFamily: "Inter, sans-serif" }}>
                  {stepMeta.sub}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Right panel / result ── */}
        {done ? (
          <div className="wd-full">
            <ResultScreen state={state} onReset={handleReset} copy={copy} />
          </div>
        ) : (
          <div className="wd-right">

            {/* STEP: category */}
            {currentStep === "category" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
                {copy.categories.map(cat => (
                  <button key={cat.id} onClick={() => { set("category", cat.id); set("subtype", null); }} style={{
                    background:  state.category === cat.id ? C.btnSelBg : C.btnBg,
                    border:      `1px solid ${state.category === cat.id ? C.btnSelBorder : C.btnBorder}`,
                    padding: "15px 11px", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                  }}>
                    <div style={{ color: state.category === cat.id ? C.accent : C.text, fontSize: 12, fontWeight: 600, marginBottom: 2, fontFamily: "Inter, sans-serif" }}>{cat.label}</div>
                    <div style={{ color: C.textDim, fontSize: 10, fontFamily: "Inter, sans-serif" }}>{cat.sub}</div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP: subtype */}
            {currentStep === "subtype" && state.category && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {(copy.subtypes[state.category] ?? []).map(sub => (
                  <SelectCard key={sub.id} item={sub} selected={state.subtype === sub.id} onClick={() => set("subtype", sub.id)} onQuote={copy.onQuote} />
                ))}
              </div>
            )}

            {/* STEP: video_duration */}
            {currentStep === "video_duration" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {copy.videoDurations.map(d => (
                  <SelectCard key={d.id} item={d} selected={state.videoDuration === d.id} onClick={() => set("videoDuration", d.id)} onQuote={copy.onQuote} />
                ))}
              </div>
            )}

            {/* STEP: extra */}
            {currentStep === "extra" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <textarea
                  className="wd-input"
                  placeholder={extraPlaceholder}
                  value={state.extra}
                  onChange={e => set("extra", e.target.value)}
                  rows={6}
                  style={{ ...inputStyle, lineHeight: 1.65, flex: 1 }}
                />
                <div style={{ color: C.textDim, fontSize: 11, marginTop: 7, fontFamily: "Inter, sans-serif" }}>{copy.extraHint}</div>
              </div>
            )}

            {/* STEP: deadline */}
            {currentStep === "deadline" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {activeDeadlines.map(d => (
                  <button key={d.id} onClick={() => set("deadline", d.id)} style={{
                    background:  state.deadline === d.id ? C.btnSelBg : C.btnBg,
                    border:      `1px solid ${state.deadline === d.id ? C.btnSelBorder : C.btnBorder}`,
                    padding: "13px 15px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s", width: "100%",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ color: state.deadline === d.id ? C.accent : C.text, fontSize: 13, fontWeight: 600, marginBottom: 2, fontFamily: "Inter, sans-serif" }}>{d.label}</div>
                      <div style={{ color: C.textDim, fontSize: 12, fontFamily: "Inter, sans-serif" }}>{d.sub}</div>
                    </div>
                    {d.surcharge > 0 ? (
                      <span style={{ background: "rgba(192,57,43,0.08)", color: d.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", fontFamily: "Inter, sans-serif" }}>+{d.surcharge}%</span>
                    ) : (
                      <span style={{ background: C.accentBg, color: C.accent, fontSize: 11, fontWeight: 600, padding: "3px 9px", fontFamily: "Inter, sans-serif" }}>{copy.standard}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* STEP: currency */}
            {currentStep === "currency" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {CURRENCIES.map(cur => (
                  <button key={cur.id} onClick={() => { set("currency", cur.id); set("budget", null); }} style={{
                    background:  state.currency === cur.id ? C.btnSelBg : C.btnBg,
                    border:      `1px solid ${state.currency === cur.id ? C.btnSelBorder : C.btnBorder}`,
                    padding: "16px 18px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s", width: "100%",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ color: state.currency === cur.id ? C.accent : C.text, fontSize: 14, fontWeight: 600, marginBottom: 3, fontFamily: "Inter, sans-serif" }}>{cur.label}</div>
                      <div style={{ color: C.textDim, fontSize: 11, fontFamily: "Inter, sans-serif" }}>{lang === "en" ? cur.sub_en : cur.sub_fr}</div>
                    </div>
                    <div style={{ color: state.currency === cur.id ? C.accent : C.textDim, fontSize: 12, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                      {cur.symbol}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP: budget */}
            {currentStep === "budget" && state.currency && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {getBudgets(state.currency, state.lang).map(b => (
                  <button key={b.id} onClick={() => set("budget", b.id)} style={{
                    background:  state.budget === b.id ? C.btnSelBg : C.btnBg,
                    border:      `1px solid ${state.budget === b.id ? C.btnSelBorder : C.btnBorder}`,
                    padding: "13px 16px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s",
                    color: state.budget === b.id ? C.accent : C.text,
                    fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif",
                  }}>{b.label}</button>
                ))}
              </div>
            )}

            {/* STEP: contact */}
            {currentStep === "contact" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                <input
                  className="wd-input"
                  placeholder={copy.contactName}
                  value={state.name}
                  onChange={e => set("name", e.target.value)}
                  style={inputStyle}
                />
                <input
                  className="wd-input"
                  placeholder={copy.contactEmail}
                  type="email"
                  value={state.email}
                  onChange={e => set("email", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <NavButtons
              onBack={stepIndex > 0 ? goBack : undefined}
              onNext={goNext}
              disabled={!canNext()}
              backLabel={copy.navBack}
              nextLabel={isLastBeforeResult ? copy.navSubmit : copy.navNext}
            />
          </div>
        )}
      </div>
    </>
  );
}
