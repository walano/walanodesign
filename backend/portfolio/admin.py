import json
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from unfold.admin import ModelAdmin, TabularInline
from .models import Project, ProjectImage, Devis, SiteConfig, Client, ServicePrice, ContactMessage, PortfolioPreviewSlot


class ProjectImageInline(TabularInline):
    model  = ProjectImage
    extra  = 3
    fields = ["image", "order"]


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
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
            "fields": ["title", "category", "sub_type", "order", "published"],
        }),
        ("YouTube", {
            "fields":  ["youtube_url", "yt_title", "yt_published", "yt_views", "yt_thumbnail"],
            "classes": ["youtube-fieldset"],
        }),
    ]

    class Media:
        js = [
            "adminsortable2/js/sortable.js",
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
