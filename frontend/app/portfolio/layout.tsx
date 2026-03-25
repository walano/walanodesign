import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez les créations de Walano Design — covers, lyrics videos, affiches, logos, miniatures YouTube et bannières pour artistes et labels.",
  openGraph: {
    title: "Portfolio | Walano Design",
    description:
      "Covers, lyrics videos, affiches, logos, miniatures YouTube et bannières pour artistes et labels indépendants.",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
