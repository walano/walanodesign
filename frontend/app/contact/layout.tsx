import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Walano Design pour discuter de votre projet — covers, branding, lyrics video, affiches ou miniatures.",
  openGraph: {
    title: "Contact | Walano Design",
    description:
      "Décrivez votre projet et obtenez une réponse directe de Walano Design.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
