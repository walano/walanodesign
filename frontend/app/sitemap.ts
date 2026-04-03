import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.walanodesign.com";
  return [
    { url: base,                            lastModified: new Date(), changeFrequency: "monthly", priority: 1   },
    { url: `${base}/portfolio`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/devis`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/conditions`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/confidentialite`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/mentions-legales`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
