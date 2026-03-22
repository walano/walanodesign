import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Walans Design — Design visuel pour la musique",
  description:
    "Covers, vidéos, affiches, branding et miniatures pour artistes et labels indépendants.",
  openGraph: {
    title: "Walans Design",
    description: "Design visuel pour l'industrie musicale",
    siteName: "Walans Design",
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
