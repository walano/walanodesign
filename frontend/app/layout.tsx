import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const base: Partial<Metadata> = {
  metadataBase: new URL("https://walanodesign.com"),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  authors: [{ name: "Walano Design" }],
  creator: "Walano Design",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const metadataFR: Metadata = {
  ...base,
  title: {
    default: "Walano Design — Graphiste Freelance | Covers, Logos & Identités Visuelles, Affiches, Vidéos",
    template: "%s | Walano Design",
  },
  description:
    "Graphiste freelance spécialisé dans les covers, logos, identités visuelles, affiches et vidéos pour artistes et labels. Devis gratuit en ligne.",
  keywords: [
    "walano design",
    "graphiste freelance",
    "cover album",
    "pochette single",
    "identité visuelle",
    "lyrics video",
    "branding artiste",
    "miniatures youtube",
    "affiche concert",
    "design visuel",
  ],
  openGraph: {
    title: "Walano Design — Graphiste Freelance | Covers, Logos & Identités Visuelles",
    description:
      "Covers, logos, identités visuelles, affiches et vidéos pour artistes et labels indépendants.",
    siteName: "Walano Design",
    url: "https://walanodesign.com",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "https://walanodesign.com/me.jpg", alt: "Walano Design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walano Design — Graphiste Freelance",
    description:
      "Covers, logos, identités visuelles, affiches et vidéos pour artistes et labels.",
    images: ["https://walanodesign.com/me.jpg"],
  },
};

const metadataEN: Metadata = {
  ...base,
  title: {
    default: "Walano Design — Freelance Graphic Designer | Covers, Logos & Visual Identity, Posters, Videos",
    template: "%s | Walano Design",
  },
  description:
    "Freelance graphic designer specializing in covers, logos, visual identity, posters and videos for artists and labels. Free quote online.",
  keywords: [
    "walano design",
    "freelance graphic designer",
    "album cover",
    "single artwork",
    "visual identity",
    "lyrics video",
    "artist branding",
    "youtube thumbnails",
    "concert poster",
    "graphic design",
  ],
  openGraph: {
    title: "Walano Design — Freelance Graphic Designer | Covers, Logos & Visual Identity",
    description:
      "Covers, logos, visual identity, posters and videos for independent artists and labels.",
    siteName: "Walano Design",
    url: "https://walanodesign.com",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://walanodesign.com/me.jpg", alt: "Walano Design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walano Design — Freelance Graphic Designer",
    description:
      "Covers, logos, visual identity, posters and videos for artists and labels.",
    images: ["https://walanodesign.com/me.jpg"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const isFr = !acceptLanguage.toLowerCase().startsWith("en");
  return isFr ? metadataFR : metadataEN;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Walano Design",
  description:
    "Graphiste freelance spécialisé dans les covers, logos, identités visuelles, affiches et vidéos pour artistes et labels.",
  url: "https://www.walanodesign.com",
  email: "contact@walanodesign.com",
  image: "https://www.walanodesign.com/me.jpg",
  priceRange: "$$",
  serviceType: [
    "Graphic Design",
    "Logo Design",
    "Album Cover Design",
    "Visual Identity",
    "Poster Design",
    "Lyrics Video",
    "YouTube Thumbnails",
  ],
  areaServed: "Worldwide",
  sameAs: [
    "https://www.instagram.com/saint_walano/",
    "https://www.facebook.com/walanodesign/",
    "https://x.com/saint_walano",
    "https://www.pinterest.com/walanodesign/",
    "https://www.behance.net/walanodesign",
    "https://www.tiktok.com/@saint_walano",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bnd5kll.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
