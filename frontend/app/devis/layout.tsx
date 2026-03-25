import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obtenir un devis gratuit",
  description:
    "Configurez votre projet en quelques étapes et recevez une estimation personnalisée par Walano Design.",
  openGraph: {
    title: "Devis gratuit | Walano Design",
    description:
      "Configurez votre projet covers, branding, lyrics video, affiches ou miniatures et obtenez une estimation sur mesure.",
  },
};

export default function DevisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
