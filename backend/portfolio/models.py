import os
import re
import requests
from django.db import models
from django.core.exceptions import ValidationError


def _fetch_youtube_meta(video_id: str) -> dict:
    api_key = os.getenv("YOUTUBE_API_KEY", "")
    if not api_key or not video_id:
        return {}
    try:
        resp = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={"part": "snippet,statistics", "id": video_id, "key": api_key},
            timeout=5,
        )
        items = resp.json().get("items", [])
        if not items:
            return {}
        snippet    = items[0].get("snippet", {})
        statistics = items[0].get("statistics", {})
        thumbs     = snippet.get("thumbnails", {})
        thumb      = (thumbs.get("maxres") or thumbs.get("high") or {}).get("url", "")
        return {
            "yt_title":     snippet.get("title", ""),
            "yt_published": snippet.get("publishedAt", "")[:10],
            "yt_views":     int(statistics.get("viewCount", 0)),
            "yt_thumbnail": thumb,
        }
    except Exception:
        return {}


def _extract_video_id(url: str) -> str:
    if not url:
        return ""
    match = re.search(r"(?:v=|youtu\.be/|embed/)([A-Za-z0-9_-]{11})", url)
    return match.group(1) if match else ""


CATEGORY_CHOICES = [
    ("covers",     "Covers"),
    ("branding",   "Logo & Branding"),
    ("videos",     "Vidéos"),
    ("affiches",   "Affiches"),
    ("miniatures", "Miniatures"),
    ("bannieres",  "Bannières"),
]

SUB_TYPE_CHOICES = [
    ("single",    "Single"),
    ("album",     "Album"),
    ("logo",      "Logo"),
    ("branding",  "Branding"),
    ("affiche",   "Affiche"),
    ("pack",      "Pack"),
    ("miniature", "Miniature"),
    ("video",     "Vidéo"),
    ("banniere",  "Bannière"),
]

VALID_SUB_TYPES = {
    "covers":     ["single", "album"],
    "branding":   ["logo", "branding"],
    "affiches":   ["affiche", "pack"],
    "miniatures": ["miniature"],
    "videos":     ["video"],
    "bannieres":  ["banniere"],
}


class Project(models.Model):
    title        = models.CharField(max_length=200, verbose_name="Titre")
    category     = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="Catégorie")
    sub_type     = models.CharField(max_length=20, choices=SUB_TYPE_CHOICES, verbose_name="Type", default="single")
    youtube_url  = models.URLField(blank=True, null=True, verbose_name="URL YouTube")
    yt_title     = models.CharField(max_length=300, blank=True, default="")
    yt_published = models.CharField(max_length=10,  blank=True, default="", verbose_name="Date de publication")
    yt_views     = models.PositiveIntegerField(default=0, verbose_name="Vues")
    yt_thumbnail = models.URLField(blank=True, default="", verbose_name="Miniature YouTube")
    thumbnail    = models.ImageField(upload_to="thumbnails/", blank=True, null=True, verbose_name="Miniature personnalisée")
    order        = models.PositiveIntegerField(default=0)
    published    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "order"]
        verbose_name = "Projet"

    def clean(self):
        valid = VALID_SUB_TYPES.get(self.category, [])
        if self.sub_type not in valid:
            raise ValidationError({"sub_type": f"Type invalide pour la catégorie '{self.get_category_display()}'."})
        if self.sub_type == "video" and not self.youtube_url:
            raise ValidationError({"youtube_url": "URL YouTube requise pour une vidéo."})

    def refresh_youtube(self):
        video_id = _extract_video_id(self.youtube_url or "")
        if video_id:
            meta = _fetch_youtube_meta(video_id)
            for field, value in meta.items():
                setattr(self, field, value)

    def save(self, *args, **kwargs):
        self.refresh_youtube()
        if self.sub_type == "video" and self.yt_title:
            self.title = self.yt_title
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_sub_type_display()})"


def project_image_path(instance, filename):
    ext  = filename.split(".")[-1]
    name = instance.project.title.lower().replace(" ", "-")
    return f"projects/{name}/{instance.order or 0}.{ext}"


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Projet"
    )
    image = models.ImageField(upload_to=project_image_path)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Image"

    def __str__(self):
        return f"{self.project.title} — image {self.order}"


class SiteConfig(models.Model):
    about_text  = models.TextField(blank=True, default="", verbose_name="Texte à propos")
    about_photo = models.ImageField(upload_to="site/", blank=True, null=True, verbose_name="Photo")

    class Meta:
        verbose_name        = "Configuration du site"
        verbose_name_plural = "Configuration du site"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Configuration du site"


class Client(models.Model):
    name   = models.CharField(max_length=100, verbose_name="Nom")
    role   = models.CharField(max_length=100, verbose_name="Rôle / Fonction")
    avatar = models.ImageField(upload_to="clients/", blank=True, null=True, verbose_name="Photo")
    order  = models.PositiveIntegerField(default=0, verbose_name="Ordre")

    class Meta:
        ordering            = ["order"]
        verbose_name        = "Client"
        verbose_name_plural = "Clients"

    def __str__(self):
        return f"{self.name} — {self.role}"


class ServicePrice(models.Model):
    CATEGORY_CHOICES = [
        ("covers",     "Covers"),
        ("branding",   "Logo & Branding"),
        ("videos",     "Lyrics Video"),
        ("affiches",   "Affiches"),
        ("miniatures", "Miniatures YouTube"),
        ("bannieres",  "Bannières & Profils"),
    ]

    category   = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="Catégorie")
    subtype    = models.CharField(max_length=50, verbose_name="Sous-type", help_text="ex: single, album_3d, logo, cinematique…")
    label      = models.CharField(max_length=100, verbose_name="Label", help_text="Nom affiché dans le prompt Claude")
    price_fcfa = models.PositiveIntegerField(default=0, verbose_name="Prix (FCFA)", help_text="Prix de base en FCFA (sans supplément)")
    note       = models.TextField(blank=True, default="", verbose_name="Note interne", help_text="Non envoyé au client — infos internes uniquement")
    active     = models.BooleanField(default=True, verbose_name="Actif")
    order      = models.PositiveIntegerField(default=0, verbose_name="Ordre")

    class Meta:
        ordering            = ["category", "order"]
        verbose_name        = "Tarif de service"
        verbose_name_plural = "Tarifs de services"

    def __str__(self):
        return f"{self.get_category_display()} — {self.label} : {self.price_fcfa:,} FCFA".replace(",", ".")


class PortfolioPreviewSlot(models.Model):
    DEVICE_CHOICES = [("desktop", "Desktop"), ("mobile", "Mobile")]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name="Projet", related_name="preview_slots")
    device  = models.CharField(max_length=10, choices=DEVICE_CHOICES, verbose_name="Écran")
    order   = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    active  = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        ordering            = ["device", "order"]
        unique_together     = [["project", "device"]]
        verbose_name        = "Slot de prévisualisation"
        verbose_name_plural = "Slots de prévisualisation"

    def __str__(self):
        return f"{self.get_device_display()} — {self.project.title} (#{self.order})"


BLOG_CATEGORY_CHOICES = [
    ("branding",  "Branding"),
    ("tarifs",    "Tarifs"),
    ("process",   "Process"),
    ("tendances", "Tendances"),
    ("musique",   "Musique"),
]


class BlogPost(models.Model):
    slug         = models.SlugField(max_length=255, unique=True)
    title        = models.CharField(max_length=255, verbose_name="Titre")
    description  = models.TextField(verbose_name="Meta description (SEO, max 160 car.)")
    category     = models.CharField(max_length=100, choices=BLOG_CATEGORY_CHOICES, verbose_name="Catégorie")
    thumbnail    = models.URLField(max_length=500, blank=True, default="", verbose_name="Thumbnail (URL Cloudinary)")
    content      = models.TextField(verbose_name="Contenu (markdown)")
    published    = models.BooleanField(default=True, verbose_name="Publié")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de publication")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering            = ["-published_at"]
        verbose_name        = "Article de blog"
        verbose_name_plural = "Articles de blog"

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name       = models.CharField(max_length=100, verbose_name="Nom")
    email      = models.EmailField(verbose_name="Email")
    subject    = models.CharField(max_length=200, verbose_name="Sujet")
    message    = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ["-created_at"]
        verbose_name        = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self):
        return f"{self.name} — {self.subject} ({self.created_at.strftime('%d/%m/%Y')})"


class Devis(models.Model):
    CATEGORY_CHOICES = [
        ("covers",     "Covers"),
        ("branding",   "Logo & Branding"),
        ("videos",     "Lyrics Video"),
        ("affiches",   "Affiches"),
        ("miniatures", "Miniatures YouTube"),
        ("bannieres",  "Bannières & Profils"),
    ]

    CURRENCY_CHOICES = [("FCFA", "FCFA"), ("EUR", "EUR"), ("USD", "USD")]

    category       = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    subtype        = models.CharField(max_length=30)
    video_duration = models.CharField(max_length=20, blank=True, default="")
    extra          = models.TextField(blank=True, default="")
    deadline       = models.CharField(max_length=20)
    currency       = models.CharField(max_length=5, choices=CURRENCY_CHOICES, default="FCFA")
    budget         = models.CharField(max_length=10)
    name           = models.CharField(max_length=100)
    email          = models.EmailField()
    ai_response    = models.JSONField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering     = ["-created_at"]
        verbose_name = "Devis"
        verbose_name_plural = "Devis"

    def __str__(self):
        return f"{self.name} — {self.get_category_display()} ({self.created_at.strftime('%d/%m/%Y')})"
