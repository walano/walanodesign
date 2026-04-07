"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
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
      category:       { title: "Quel est votre projet ?",         sub: "Sélectionnez la catégorie qui correspond à votre besoin." },
      subtype:        { title: "Précisez votre projet",           sub: "Choisissez l'option qui correspond le mieux à ce que vous recherchez." },
      video_duration: { title: "Durée de la vidéo ?",             sub: "Cela nous permet d'estimer au plus juste." },
      extra:          { title: "Parlez-nous de votre projet",     sub: "Style, univers, références, date de sortie… plus vous partagez, plus la proposition sera personnalisée." },
      deadline:       { title: "Quel est votre délai ?",          sub: "Le délai influence le prix final. Soyez transparent, on s'adapte." },
      currency:       { title: "Dans quelle devise ?",            sub: "Choisissez la devise dans laquelle vous souhaitez être facturé." },
      budget:         { title: "Combien êtes-vous capable d'investir pour la réalisation de votre projet ?" },
      contact:        { title: "Vos coordonnées",                 sub: "Pour recevoir votre estimation personnalisée." },
    },
    categories: [
      { id: "covers",     label: "Covers",              sub: "single, album, 3d" },
      { id: "branding",   label: "Logo & branding",     sub: "logo, identité visuelle" },
      { id: "videos",     label: "Lyrics video",        sub: "2d, cinématique, 3d" },
      { id: "affiches",   label: "Affiches",            sub: "événement, pack, compilation" },
      { id: "miniatures", label: "Miniatures YouTube",  sub: "unique, pack, rebranding" },
      { id: "bannieres",  label: "Bannières & profils", sub: "x, twitch, youtube" },
    ],
    subtypes: {
      covers: [
        { id: "single",    label: "Cover single",    desc: "Pour un single musical" },
        { id: "album",     label: "Cover album",     desc: "Pochette d'album complète" },
        { id: "single_3d", label: "Cover single 3D", desc: "Rendu 3D" },
        { id: "album_3d",  label: "Cover album 3D",  desc: "Pochette album en 3D" },
      ],
      branding: [
        { id: "logo",    label: "Logo simple",               desc: "Un logo propre et professionnel" },
        { id: "mini",    label: "Logo + charte graphique",   desc: "Logo, couleurs, polices (1 page)" },
        { id: "complet", label: "Identité visuelle simple",  desc: "Logo + charte + supports de base" },
        { id: "premium", label: "Identité visuelle complète", desc: "Stratégie de marque + identité + supports" },
      ],
      videos: [
        { id: "simple",      label: "Typographie & arrière-plan simple",  desc: "Texte animé sur fond statique" },
        { id: "bg_anime",    label: "Typographie & arrière-plan animés",  desc: "Fond animé + typographies" },
        { id: "minimaliste", label: "Animation minimaliste",              desc: "Épuré, transitions fluides" },
        { id: "cinematique", label: "Cinématique",                        desc: "Footage vidéo + overlay texte" },
        { id: "3d",          label: "3D",                                 desc: "Animation 3D complète" },
      ],
      affiches: [
        { id: "unique",      label: "Affiche unique",    desc: "Un seul visuel événementiel" },
        { id: "pack",        label: "Pack événement",    desc: "Plusieurs visuels pour un événement" },
        { id: "compilation", label: "Compilation",       desc: "Série de visuels thématiques" },
        { id: "entreprise",  label: "Projet entreprise", desc: "Long terme, volume important", badge: "à discuter" },
      ],
      miniatures: [
        { id: "unique",     label: "Miniature unique",      desc: "Pour une vidéo spécifique" },
        { id: "pack",       label: "Pack miniatures",       desc: "Plusieurs vidéos, tarif dégressif" },
        { id: "rebranding", label: "Rebranding miniatures", desc: "Refonte de tout votre catalogue", badge: "à discuter" },
      ],
      bannieres: [
        { id: "banniere",   label: "Bannière seule",     desc: "Header de chaîne / page" },
        { id: "profil",     label: "Photo de profil",    desc: "Avatar professionnel" },
        { id: "both",       label: "Bannière + profil",  desc: "Pack complet réseaux" },
        { id: "rebranding", label: "Rebranding de page", desc: "Refonte visuelle complète", badge: "à discuter" },
      ],
    } as Record<string, { id: string; label: string; desc: string; badge?: string }[]>,
    videoDurations: [
      { id: "short",  label: "Moins de 2 min" },
      { id: "medium", label: "2 à 4 min" },
      { id: "long",   label: "4 à 6 min" },
      { id: "xlong",  label: "Plus de 6 min", badge: "à discuter" },
    ],
    deadlines: [
      { id: "urgent",   label: "Rush",     sub: "1 à 3 jours",          surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "Rapide",   sub: "3 à 7 jours",          surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "Standard", sub: "1 à 2 semaines",       surcharge: 0,  color: C.accent },
      { id: "flexible", label: "Flexible", sub: "Pas de date précise",  surcharge: 0,  color: C.textMid },
    ],
    deadlinesVideo: [
      { id: "urgent",   label: "Rush",     sub: "5 à 10 jours",         surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "Rapide",   sub: "10 à 14 jours",        surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "Standard", sub: "2 à 4 semaines",       surcharge: 0,  color: C.accent },
      { id: "flexible", label: "Flexible", sub: "Pas de date précise",  surcharge: 0,  color: C.textMid },
    ],
    onQuote: "sur devis",
    standard: "Standard",
    navBack: "Retour",
    navNext: "Continuer",
    navSubmit: "Obtenir mon estimation",
    navReset: "Nouvelle estimation",
    navHome: "Retour à l'accueil",
    extraHint: "Optionnel, mais ça change tout.",
    disclaimer: "Cette estimation est un point de départ basé sur ce que vous nous avez partagé. Chaque projet étant unique, nous prendrons le temps d'échanger pour affiner les détails ensemble si besoin.",
    extraPlaceholders: {
      covers:     "Ex : je sors un EP afrobeats en mars, je veux quelque chose dans un style sombre et cinématique. Ou je n'ai pas les mots exacts, mais voici une référence : [lien].",
      branding:   "Ex : je lance une marque de streetwear urbain, cible 18–30 ans, je veux un logo bold et moderne. Ou partagez simplement une référence visuelle.",
      videos:     "Ex : clip mélancolique trap, esthétique urbaine la nuit, visuels sombres. Partagez un lien de référence si possible.",
      affiches:   "Parlez-nous de votre événement ou projet : type d'événement, date, lieu, style visuel, artistes impliqués. Partagez une référence si vous en avez une.",
      miniatures: "Décrivez le type de vidéos que vous publiez, votre audience, et le style de miniatures que vous recherchez. Une référence est toujours utile.",
      bannieres:  "Parlez-nous du type de contenu que vous créez, votre univers visuel, et ce que vous souhaitez projeter sur vos réseaux.",
      default:    "Ex : décrivez votre projet, votre univers visuel, vos références…",
    },
    contactName:  "Votre prénom",
    contactEmail: "Votre email",
    step: "Étape",
    of:   "sur",
    result: {
      title:          "Votre estimation",
      subtitle:       "Préparée par Walano Design",
      loading1:       "Walano analyse votre projet…",
      loading2:       "Préparation de votre pack personnalisé",
      error:          "Une erreur est survenue. Veuillez réessayer.",
      proposal:       "Ce qu'on vous propose",
      urgencySurge:   "Supplément urgence +30% inclus",
      fastSurge:      "Supplément délai rapide +15% inclus",
      goFurther:      "Pour aller plus loin",
      sentTo:         "Envoyé à",
      spamNotice:     "Si vous ne trouvez pas l'email dans votre boîte principale, vérifiez vos spams ou l'onglet Promotions.",
      validity:       "Cette estimation est valable 15 jours. Passé ce délai, une nouvelle demande sera nécessaire.",
    },
  },

  en: {
    stepMeta: {
      category:       { title: "What's your project?",              sub: "Select the category that matches your need." },
      subtype:        { title: "Specify your project",              sub: "Choose the option that best matches what you're looking for." },
      video_duration: { title: "Video duration?",                   sub: "This helps us give you the most accurate estimate." },
      extra:          { title: "Tell us about your project",        sub: "Style, universe, references, release date… the more you share, the more personalized the proposal." },
      deadline:       { title: "What's your deadline?",             sub: "The deadline affects the final price. Be transparent, we'll adapt." },
      currency:       { title: "In which currency?",                sub: "Choose the currency you wish to be invoiced in." },
      budget:         { title: "How much are you willing to invest for your project?" },
      contact:        { title: "Your details",                      sub: "To receive your personalized estimate." },
    },
    categories: [
      { id: "covers",     label: "Covers",              sub: "single, album, 3d" },
      { id: "branding",   label: "Logo & branding",     sub: "logo, visual identity" },
      { id: "videos",     label: "Lyrics video",        sub: "2d, cinematic, 3d" },
      { id: "affiches",   label: "Posters",             sub: "event, pack, compilation" },
      { id: "miniatures", label: "YouTube thumbnails",  sub: "unique, pack, rebrand" },
      { id: "bannieres",  label: "Banners & profiles",  sub: "x, twitch, youtube" },
    ],
    subtypes: {
      covers: [
        { id: "single",    label: "Single cover",    desc: "For a music single" },
        { id: "album",     label: "Album cover",     desc: "Full album artwork" },
        { id: "single_3d", label: "Single cover 3D", desc: "3D render" },
        { id: "album_3d",  label: "Album cover 3D",  desc: "Album artwork in 3D" },
      ],
      branding: [
        { id: "logo",    label: "Simple logo",               desc: "A clean and professional logo" },
        { id: "mini",    label: "Logo + brand guidelines",   desc: "Logo, colors, fonts (1 page)" },
        { id: "complet", label: "Simple visual identity",    desc: "Logo + guidelines + basic assets" },
        { id: "premium", label: "Complete visual identity",  desc: "Brand strategy + identity + assets" },
      ],
      videos: [
        { id: "simple",      label: "Typography & simple background",   desc: "Animated text on static background" },
        { id: "bg_anime",    label: "Typography & animated background", desc: "Animated bg + typography" },
        { id: "minimaliste", label: "Minimalist animation",             desc: "Clean, smooth transitions" },
        { id: "cinematique", label: "Cinematic",                        desc: "Video footage + text overlay" },
        { id: "3d",          label: "3D",                               desc: "Full 3D animation" },
      ],
      affiches: [
        { id: "unique",      label: "Single poster",   desc: "One event visual" },
        { id: "pack",        label: "Event pack",      desc: "Multiple visuals for an event" },
        { id: "compilation", label: "Compilation",     desc: "Series of themed visuals" },
        { id: "entreprise",  label: "Business project", desc: "Long term, high volume", badge: "to be discussed" },
      ],
      miniatures: [
        { id: "unique",     label: "Single thumbnail",  desc: "For a specific video" },
        { id: "pack",       label: "Thumbnail pack",    desc: "Multiple videos, volume pricing" },
        { id: "rebranding", label: "Thumbnail rebrand", desc: "Full catalog overhaul", badge: "to be discussed" },
      ],
      bannieres: [
        { id: "banniere",   label: "Banner only",      desc: "Channel / page header" },
        { id: "profil",     label: "Profile picture",  desc: "Professional avatar" },
        { id: "both",       label: "Banner + profile", desc: "Complete social pack" },
        { id: "rebranding", label: "Page rebrand",     desc: "Full visual overhaul", badge: "to be discussed" },
      ],
    } as Record<string, { id: string; label: string; desc: string; badge?: string }[]>,
    videoDurations: [
      { id: "short",  label: "Less than 2 min" },
      { id: "medium", label: "2 to 4 min" },
      { id: "long",   label: "4 to 6 min" },
      { id: "xlong",  label: "More than 6 min", badge: "to be discussed" },
    ],
    deadlines: [
      { id: "urgent",   label: "Rush",     sub: "1 to 3 days",       surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "Fast",     sub: "3 to 7 days",       surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "Standard", sub: "1 to 2 weeks",      surcharge: 0,  color: C.accent },
      { id: "flexible", label: "Flexible", sub: "No specific date",  surcharge: 0,  color: C.textMid },
    ],
    deadlinesVideo: [
      { id: "urgent",   label: "Rush",     sub: "5 to 10 days",      surcharge: 30, color: "#c0392b" },
      { id: "rapide",   label: "Fast",     sub: "10 to 14 days",     surcharge: 15, color: "#b7770d" },
      { id: "normal",   label: "Standard", sub: "2 to 4 weeks",      surcharge: 0,  color: C.accent },
      { id: "flexible", label: "Flexible", sub: "No specific date",  surcharge: 0,  color: C.textMid },
    ],
    onQuote: "on quote",
    standard: "Standard",
    navBack: "Back",
    navNext: "Continue",
    navSubmit: "Get my estimate",
    navReset: "New estimate",
    navHome: "Back to home",
    extraHint: "Optional, but it changes everything.",
    disclaimer: "This estimate is a starting point based on what you've shared with us. Every project being unique, we'll take the time to fine-tune the details together if needed.",
    extraPlaceholders: {
      covers:     "E.g. I'm releasing an afrobeats EP in March, I want something dark and cinematic. Or I don't have the exact words yet, but here's a reference: [link].",
      branding:   "E.g. I'm launching an urban streetwear brand targeting 18–30. I want a bold, modern logo. Or just share a visual reference.",
      videos:     "E.g. melancholic trap clip, urban night aesthetic, dark visuals. Share a reference link if possible.",
      affiches:   "Tell us about your event or project: type of event, date, venue, visual style, artists involved. Share a reference if you have one.",
      miniatures: "Describe the type of videos you post, your audience, and the thumbnail style you're going for. A reference or example always helps.",
      bannieres:  "Tell us about the type of content you create, your visual universe, and what you want to convey on your socials.",
      default:    "E.g. describe your project, visual universe, references…",
    },
    contactName:  "Your first name",
    contactEmail: "Your email",
    step: "Step",
    of:   "of",
    result: {
      title:          "Your estimate",
      subtitle:       "Prepared by Walano Design",
      loading1:       "Walano is analyzing your project…",
      loading2:       "Preparing your personalized package",
      error:          "An error occurred. Please try again.",
      proposal:       "Our proposal",
      urgencySurge:   "Urgency surcharge +30% included",
      fastSurge:      "Fast deadline surcharge +15% included",
      goFurther:      "Go further",
      sentTo:         "Sent to",
      spamNotice:     "If you don't find the email in your inbox, check your spam or Promotions tab.",
      validity:       "This estimate is valid for 15 days. After that, a new request will be required.",
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

// ─── Result error boundary ─────────────────────────────────────────────────────
class ResultErrorBoundary extends Component<{ children: ReactNode; errorMsg: string; onReset: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 0" }}>
          <p style={{ color: C.textMid, fontSize: 14, fontFamily: "Inter, sans-serif", margin: 0 }}>{this.props.errorMsg}</p>
          <button onClick={this.props.onReset} style={{
            alignSelf: "flex-start", background: C.accent, border: `1px solid ${C.accent}`,
            color: "#fff", padding: "11px 20px", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
          }}>réessayer</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ state, onReset, copy, lang }: {
  state: FormState;
  onReset: () => void;
  copy: typeof COPY["fr"];
  lang: string;
}) {
  const [result, setResult]   = useState<DevisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (attempt === 0 && fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);
    let cancelled = false;

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
      lang,
    })
      .then(r  => { if (!cancelled) setResult(r); })
      .catch((e: Error) => { if (!cancelled) setError(e.message || copy.result.error); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div style={{ background: C.innerBg, border: `1px solid ${C.innerBorder}`, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ color: C.textMid, fontSize: 14, fontFamily: "Inter, sans-serif", margin: 0 }}>{error}</p>
          <button
            onClick={() => setAttempt(a => a + 1)}
            style={{
              alignSelf: "flex-start", background: C.accent, border: `1px solid ${C.accent}`,
              color: "#fff", padding: "10px 20px", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
            }}
          >
            {lang === "en" ? "retry" : "réessayer"}
          </button>
        </div>
      )}

      {result && !loading && (
        <>
          <div>
            <span style={{ background: C.accent, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", letterSpacing: "0.04em", fontFamily: "Inter, sans-serif" }}>
              {(result.packName ?? "").toLowerCase()}
            </span>
          </div>

          <div style={{ background: C.accentBg, border: `1px solid ${C.accentBorder}`, padding: 20 }}>
            <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>{r.proposal}</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 4, fontFamily: "Inter, sans-serif" }}>{(result.offerTitle ?? "").toLowerCase()}</div>
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

      <p style={{ color: C.textDim, fontSize: 11, fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>
        {r.validity}
      </p>
      <p style={{ color: C.textDim, fontSize: 11, fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>
        {r.spamNotice}
      </p>

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

const DRAFT_KEY = "wd_devis_draft";
const DRAFT_TTL = 24 * 60 * 60 * 1000; // 24 h

export default function Estimate() {
  const { lang } = useI18n();
  const copy     = COPY[lang] ?? COPY.fr;
  const cardRef  = useRef<HTMLDivElement>(null);

  const [state, setState]         = useState<FormState>({ ...INITIAL_STATE, lang });
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone]           = useState(false);

  // ── Restore draft on mount ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { state: saved, stepIndex: savedStep, savedAt } = JSON.parse(raw);
      if (Date.now() - savedAt > DRAFT_TTL) { localStorage.removeItem(DRAFT_KEY); return; }
      setState(s => ({ ...INITIAL_STATE, ...saved, lang: s.lang }));
      setStepIndex(savedStep ?? 0);
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist draft on every change ──────────────────────────────────────────
  useEffect(() => {
    try {
      if (done) { localStorage.removeItem(DRAFT_KEY); return; }
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ state, stepIndex, savedAt: Date.now() }));
    } catch { /* ignore */ }
  }, [state, stepIndex, done]);

  // ── Sync lang from i18n context ────────────────────────────────────────────
  useEffect(() => {
    setState(s => ({ ...s, lang }));
  }, [lang]);

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
  const handleReset = () => { try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } setDone(false); setStepIndex(0); setState({ ...INITIAL_STATE, lang }); };

  const stepMeta = copy.stepMeta[currentStep as keyof typeof copy.stepMeta] || { title: "" };

  const extraPlaceholder =
    state.category === "covers"      ? copy.extraPlaceholders.covers
    : state.category === "branding"  ? copy.extraPlaceholders.branding
    : state.category === "videos"    ? copy.extraPlaceholders.videos
    : state.category === "affiches"  ? copy.extraPlaceholders.affiches
    : state.category === "miniatures" ? copy.extraPlaceholders.miniatures
    : state.category === "bannieres" ? copy.extraPlaceholders.bannieres
    : copy.extraPlaceholders.default;

  const activeDeadlines = state.category === "videos"
    ? copy.deadlinesVideo
    : copy.deadlines;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 820 }}>
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
            <ResultErrorBoundary errorMsg={copy.result.error} onReset={handleReset}>
              <ResultScreen state={state} onReset={handleReset} copy={copy} lang={lang} />
            </ResultErrorBoundary>
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
                {getBudgets(state.currency, lang).map(b => (
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

      <p style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: "clamp(0.72rem, 1.2vw, 0.78rem)",
        color: "rgba(12,12,12,0.45)",
        textAlign: "center",
        lineHeight: 1.7,
        marginTop: 14,
        padding: "0 8px",
      }}>
        {copy.disclaimer}
      </p>
    </div>
  );
}
