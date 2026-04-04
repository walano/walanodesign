import json
import os
import requests as http
from django import forms
from django.contrib import admin, messages
from django.db.models import Max
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.urls import path, reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from .models import Project, ProjectImage, Devis, SiteConfig, Client, ServicePrice, ContactMessage, PortfolioPreviewSlot, BlogPost


class BlockEditorWidget(forms.Textarea):
    """Visual block-based editor for JSONField content."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.attrs.setdefault("class", "block-editor-json")

    class Media:
        js  = ["portfolio/admin/block_editor.js"]
        css = {"all": ["portfolio/admin/block_editor.css"]}


class MultipleFileInput(forms.FileInput):
    allow_multiple_selected = True

    def __init__(self, attrs=None):
        defaults = {"multiple": True, "accept": "image/*"}
        if attrs:
            defaults.update(attrs)
        super().__init__(attrs=defaults)


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single = super().clean
        if isinstance(data, (list, tuple)):
            return [single(d, initial) for d in data]
        return [single(data, initial)]


class ProjectAdminForm(forms.ModelForm):
    bulk_images = MultipleFileField(
        label="Ajouter des images (sélection multiple)",
        required=False,
    )
    # Title is optional in the form: video projects auto-fetch it from YouTube.
    title = forms.CharField(required=False, max_length=200, label="Titre")

    class Meta:
        model  = Project
        fields = "__all__"

    def clean(self):
        cleaned  = super().clean()
        sub_type = cleaned.get("sub_type")
        # For video projects the title is auto-fetched from YouTube in model.save().
        if sub_type == "video" and not cleaned.get("title"):
            cleaned["title"] = "_yt_pending_"
        elif sub_type != "video" and not cleaned.get("title"):
            raise forms.ValidationError({"title": "Ce champ est obligatoire."})
        return cleaned


class ProjectImageInline(TabularInline):
    model  = ProjectImage
    extra  = 1
    fields = ["image", "order"]


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    form            = ProjectAdminForm
    list_display    = ["drag_handle", "title", "category", "sub_type", "yt_views", "yt_published", "published"]

    @admin.display(description="")
    def drag_handle(self, obj):
        from django.utils.safestring import mark_safe
        return mark_safe('<span class="wl-drag-handle" style="cursor:grab;color:#855c9d;font-size:1.3rem;user-select:none;padding:0 14px;">&#x2837;</span>')
    list_filter     = ["category", "sub_type", "published"]
    list_editable   = ["published"]
    search_fields   = ["title"]
    ordering        = ["category", "order"]
    inlines         = [ProjectImageInline]
    readonly_fields = ["yt_title", "yt_published", "yt_views", "yt_thumbnail"]
    fieldsets = [
        (None, {
            "fields": ["title", "category", "sub_type", "order", "published", "bulk_images"],
        }),
        ("YouTube", {
            "fields":  ["youtube_url", "thumbnail", "yt_title", "yt_published", "yt_views", "yt_thumbnail"],
            "classes": ["youtube-fieldset"],
        }),
    ]

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        files = request.FILES.getlist("bulk_images")
        if files:
            project = form.instance
            last = project.images.aggregate(m=Max("order"))["m"] or -1
            for i, f in enumerate(files):
                try:
                    ProjectImage.objects.create(project=project, image=f, order=last + 1 + i)
                except Exception as e:
                    self.message_user(request, f"Erreur upload image {f.name} : {e}", level=messages.ERROR)

    class Media:
        js = [
            "https://cdn.jsdelivr.net/npm/sortablejs@1.15.3/Sortable.min.js",
            "portfolio/admin/project_wizard.js",
            "portfolio/admin/drag_sort.js",
        ]

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("reorder/",     self.admin_site.admin_view(self.reorder_view),     name="portfolio_project_reorder"),
            path("bulk-import/", self.admin_site.admin_view(self.bulk_import_view), name="portfolio_project_bulk_import"),
        ]
        return custom + urls

    BULK_TYPE_MAP = {
        "covers__single":    {"category": "covers",   "sub_type": "single"},
        "branding__logo":    {"category": "branding", "sub_type": "logo"},
        "affiches__affiche": {"category": "affiches", "sub_type": "affiche"},
    }

    def bulk_import_view(self, request):
        if request.method == "POST":
            type_key = request.POST.get("type_key", "")
            config   = self.BULK_TYPE_MAP.get(type_key)
            if not config:
                messages.error(request, "Type de projet invalide.")
                return redirect(".")

            titles = request.POST.getlist("title")
            images = request.FILES.getlist("images")
            pairs  = [(t.strip(), img) for t, img in zip(titles, images) if t.strip()]

            if not pairs:
                messages.error(request, "Aucun projet à importer.")
                return redirect(".")

            max_order = Project.objects.filter(category=config["category"]).aggregate(m=Max("order"))["m"] or -1
            imported = 0
            for i, (title, image) in enumerate(pairs):
                try:
                    project = Project.objects.create(
                        title=title,
                        category=config["category"],
                        sub_type=config["sub_type"],
                        order=max_order + 1 + i,
                    )
                    ProjectImage.objects.create(project=project, image=image, order=0)
                    imported += 1
                except Exception as e:
                    messages.error(request, f"Erreur pour « {title} » : {e}")

            if imported:
                messages.success(request, f"{imported} projet(s) importé(s) avec succès.")
            return redirect("../")

        context = {
            **self.admin_site.each_context(request),
            "title": "Import en masse",
        }
        return render(request, "admin/portfolio/project/bulk_import.html", context)

    def reorder_view(self, request):
        if request.method != "POST":
            return JsonResponse({"ok": False}, status=405)
        try:
            ids = [int(pk) for pk in json.loads(request.body).get("ids", [])]
            for i, pk in enumerate(ids):
                Project.objects.filter(pk=pk).update(order=i)
            return JsonResponse({"ok": True})
        except Exception as e:
            return JsonResponse({"ok": False, "error": str(e)}, status=400)


@admin.register(ServicePrice)
class ServicePriceAdmin(ModelAdmin):
    list_display  = ["category", "subtype", "label", "price_fcfa", "active", "order"]
    list_editable = ["price_fcfa", "active", "order"]
    list_filter   = ["category", "active"]
    search_fields = ["label", "subtype"]
    ordering      = ["category", "order"]
    fieldsets = [
        (None, { "fields": ["category", "subtype", "label", "price_fcfa", "active", "order"] }),
        ("Note interne", { "fields": ["note"], "classes": ["collapse"] }),
    ]


@admin.register(SiteConfig)
class SiteConfigAdmin(ModelAdmin):
    fieldsets = [
        (None, { "fields": ["about_text", "about_photo"] }),
    ]

    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Client)
class ClientAdmin(ModelAdmin):
    list_display  = ["name", "role", "order"]
    list_editable = ["order"]
    search_fields = ["name", "role"]
    ordering      = ["order"]


@admin.register(PortfolioPreviewSlot)
class PortfolioPreviewSlotAdmin(ModelAdmin):
    list_display  = ["device", "order", "project", "active"]
    list_editable = ["order", "active"]
    list_filter   = ["device", "active"]
    search_fields = ["project__title"]
    ordering      = ["device", "order"]
    fieldsets = [
        (None, { "fields": ["project", "device", "order", "active"] }),
    ]


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display    = ["name", "email", "subject", "created_at"]
    search_fields   = ["name", "email", "subject"]
    readonly_fields = ["name", "email", "subject", "message", "created_at"]
    ordering        = ["-created_at"]

    def has_add_permission(self, request):
        return False


class BlogPostAdminForm(forms.ModelForm):
    class Meta:
        model   = BlogPost
        fields  = "__all__"
        widgets = {
            "content":    BlockEditorWidget(),
            "content_en": BlockEditorWidget(),
        }


@admin.register(BlogPost)
class BlogPostAdmin(ModelAdmin):
    form                = BlogPostAdminForm
    list_display        = ["title", "category", "published", "published_at"]
    list_filter         = ["category", "published"]
    list_editable       = ["published"]
    search_fields       = ["title", "slug"]
    ordering            = ["-published_at"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields     = ["translate_button"]
    fieldsets = [
        (None, {
            "fields": ["title", "title_en", "slug", "category", "thumbnail", "published", "published_at"],
        }),
        ("Description SEO", {
            "fields": ["description", "description_en"],
        }),
        ("Contenu FR", {
            "fields": ["content"],
        }),
        ("Contenu EN", {
            "fields": ["translate_button", "content_en"],
        }),
    ]

    def translate_button(self, obj):
        if not obj or not obj.pk:
            return "Sauvegardez l'article d'abord."
        url = reverse("admin:portfolio_blogpost_translate") + f"?pk={obj.pk}"
        return format_html(
            '<a href="{}" class="be-translate-btn">Traduire FR → EN avec Claude</a>',
            url,
        )
    translate_button.short_description = ""

    def get_urls(self):
        return [
            path("translate/", self.admin_site.admin_view(self.translate_view), name="portfolio_blogpost_translate"),
        ] + super().get_urls()

    def translate_view(self, request):
        pk = request.GET.get("pk")
        if not pk:
            messages.error(request, "pk manquant.")
            return redirect(reverse("admin:portfolio_blogpost_changelist"))
        post = BlogPost.objects.get(pk=pk)
        post = BlogPost.objects.get(pk=pk)

        if not post.content:
            messages.error(request, "Pas de contenu FR à traduire.")
            return redirect(reverse("admin:portfolio_blogpost_change", args=[pk]))

        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if not api_key:
            messages.error(request, "ANTHROPIC_API_KEY manquante dans les variables d'environnement.")
            return redirect(reverse("admin:portfolio_blogpost_change", args=[pk]))

        prompt = (
            "Translate the text fields in these JSON content blocks from French to English.\n"
            "Rules:\n"
            "- Only translate the values of \"text\" and \"caption\" fields\n"
            "- Keep \"url\", \"type\", and all other fields exactly as-is\n"
            "- Preserve **bold** and *italic* markers exactly as written\n"
            "- Return ONLY the JSON array, no explanation, no code fences\n\n"
            + json.dumps(post.content, ensure_ascii=False)
        )

        try:
            resp = http.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key":         api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type":      "application/json",
                },
                json={
                    "model":      "claude-haiku-4-5-20251001",
                    "max_tokens": 4096,
                    "messages":   [{"role": "user", "content": prompt}],
                },
                timeout=30,
            )
            raw = resp.json()["content"][0]["text"].strip()
            # Strip code fences if Claude added them
            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            post.content_en = json.loads(raw)
            post.save(update_fields=["content_en"])
            messages.success(request, "✓ Traduction EN sauvegardée avec succès.")
        except Exception as e:
            messages.error(request, f"Erreur lors de la traduction : {e}")

        return redirect(reverse("admin:portfolio_blogpost_change", args=[pk]))


@admin.register(Devis)
class DevisAdmin(ModelAdmin):
    list_display  = ["name", "email", "category", "subtype", "currency", "deadline", "budget", "created_at"]
    list_filter   = ["category", "currency", "deadline", "budget"]
    search_fields = ["name", "email"]
    readonly_fields = ["category", "subtype", "video_duration", "extra", "deadline", "currency", "budget", "name", "email", "ai_response", "created_at"]
    ordering      = ["-created_at"]
