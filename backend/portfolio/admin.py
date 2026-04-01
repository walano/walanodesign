import json
from django import forms
from django.contrib import admin
from django.db.models import Max
from django.http import JsonResponse
from django.urls import path
from unfold.admin import ModelAdmin, TabularInline
from .models import Project, ProjectImage, Devis, SiteConfig, Client, ServicePrice, ContactMessage, PortfolioPreviewSlot


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

    class Meta:
        model  = Project
        fields = "__all__"

    def clean(self):
        cleaned  = super().clean()
        sub_type = cleaned.get("sub_type")
        # For video projects the title is auto-fetched from YouTube — use a
        # placeholder so form validation passes; models.save() overwrites it.
        if sub_type == "video" and not cleaned.get("title"):
            cleaned["title"] = "_yt_pending_"
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
            "fields":  ["youtube_url", "yt_title", "yt_published", "yt_views", "yt_thumbnail"],
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
                ProjectImage.objects.create(project=project, image=f, order=last + 1 + i)

    class Media:
        js = [
            "https://cdn.jsdelivr.net/npm/sortablejs@1.15.3/Sortable.min.js",
            "portfolio/admin/project_wizard.js",
            "portfolio/admin/drag_sort.js",
        ]

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("reorder/", self.admin_site.admin_view(self.reorder_view), name="portfolio_project_reorder"),
        ]
        return custom + urls

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


@admin.register(Devis)
class DevisAdmin(ModelAdmin):
    list_display  = ["name", "email", "category", "subtype", "currency", "deadline", "budget", "created_at"]
    list_filter   = ["category", "currency", "deadline", "budget"]
    search_fields = ["name", "email"]
    readonly_fields = ["category", "subtype", "video_duration", "extra", "deadline", "currency", "budget", "name", "email", "ai_response", "created_at"]
    ordering      = ["-created_at"]
