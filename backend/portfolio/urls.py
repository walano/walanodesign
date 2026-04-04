from django.urls import path
from . import views

urlpatterns = [
    path("projects/",              views.projects),
    path("projects/<int:pk>/",     views.project_detail),
    path("preview-slots/",         views.preview_slots),
    path("blog/",                  views.blog_list),
    path("blog/<slug:slug>/",      views.blog_detail),
    path("devis/",                 views.devis),
    path("contact/",               views.contact),
    path("site-config/",           views.site_config),
    path("clients/",               views.clients),
]
