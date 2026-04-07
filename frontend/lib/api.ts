const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface DevisPayload {
  category:       string;
  subtype:        string;
  videoDuration?: string;
  extra:          string;
  deadline:       string;
  currency:       string;
  budget:         string;
  name:           string;
  email:          string;
  lang:           string;
}

export interface DevisResult {
  packName:     string;
  offerTitle:   string;
  price:        string;
  offerDetails: string;
  message:      string;
  upsell?:      string;
}

export async function submitDevis(payload: DevisPayload): Promise<DevisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35_000);

  try {
    const res = await fetch(`${API_URL}/api/devis/`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erreur ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error(
        payload.lang === "en"
          ? "Request timed out. Please try again."
          : "La requête a pris trop de temps. Réessayez."
      );
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface ProjectImage {
  id:    number;
  url:   string;
  order: number;
}

export interface Project {
  id:           number;
  title:        string;
  category:     string;
  sub_type:     string;
  order:        number;
  images:       ProjectImage[];
  youtube_url:   string | null;
  yt_title:      string;
  yt_published:  string;
  yt_views:      number;
  yt_thumbnail:  string;
  thumbnail_url: string | null;
  description:   string;
}

export interface SiteConfig {
  about_text:      string;
  about_photo_url: string | null;
}

export interface Client {
  id:         number;
  name:       string;
  role:       string;
  avatar_url: string | null;
  order:      number;
}

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(`${API_URL}/api/site-config/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchClients(): Promise<Client[]> {
  try {
    const res = await fetch(`${API_URL}/api/clients/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export interface ContactPayload {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/contact/`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erreur serveur");
}

export interface PreviewSlot {
  id:      number;
  device:  "desktop" | "mobile";
  order:   number;
  project: Project;
}

export async function fetchPreviewSlots(device: "desktop" | "mobile"): Promise<PreviewSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/preview-slots/?device=${device}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchProject(id: number): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/api/projects/${id}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchProjects(category?: string): Promise<Project[]> {
  const url = category
    ? `${API_URL}/api/projects/?category=${category}`
    : `${API_URL}/api/projects/`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export type ContentBlock =
  | { type: "heading";   text: string }
  | { type: "paragraph"; text: string }
  | { type: "image";     url: string; alt?: string }
  | { type: "link";      text: string; url: string }
  | { type: "embed";     url: string; caption?: string }

export interface BlogPost {
  id:             number;
  slug:           string;
  title:          string;
  title_en:       string;
  description:    string;
  description_en: string;
  category:       string;
  thumbnail:      string;
  content?:       ContentBlock[];
  content_en?:    ContentBlock[];
  published_at:   string | null;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}
