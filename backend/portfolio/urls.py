from django.urls import path
from . import views

urlpatterns = [
    path("projects/",      views.projects),
    path("preview-slots/", views.preview_slots),
    path("devis/",      views.devis),
    path("contact/",    views.contact),
    path("site-config/",views.site_config),
    path("clients/",    views.clients),
]
