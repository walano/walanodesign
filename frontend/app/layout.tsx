import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://walanodesign.com"),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  title: {
    default: "Walano Design | Design visuel pour la musique",
    template: "%s | Walano Design",
  },
  description:
    "Covers, lyrics videos, affiches, logo & branding, miniatures YouTube pour artistes et labels indépendants. Devis gratuit en ligne.",
  keywords: [
    "walano design",
    "graphiste musique",
    "cover album",
    "pochette single",
    "lyrics video",
    "branding artiste",
    "miniatures youtube",
    "affiche concert",
    "design visuel musique",
    "graphic designer music",
    "album artwork",
    "music branding",
  ],
  authors: [{ name: "Walano Design" }],
  creator: "Walano Design",
  openGraph: {
    title: "Walano Design | Design visuel pour la musique",
    description:
      "Covers, lyrics videos, affiches, logo & branding, miniatures YouTube pour artistes et labels indépendants.",
    siteName: "Walano Design",
    url: "https://walanodesign.com",
    type: "website",
    images: [
      {
        url: "/me.png",
        alt: "Walano Design — Design visuel pour la musique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walano Design | Design visuel pour la musique",
    description:
      "Covers, lyrics videos, affiches, branding pour artistes indépendants.",
    images: ["/me.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
