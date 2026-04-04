from rest_framework import serializers
from .models import Project, ProjectImage, SiteConfig, Client, PortfolioPreviewSlot, BlogPost


class ProjectImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model  = ProjectImage
        fields = ["id", "url", "order"]

    def get_url(self, obj):
        return obj.image.url if obj.image else None


class SiteConfigSerializer(serializers.ModelSerializer):
    about_photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = SiteConfig
        fields = ["about_text", "about_photo_url"]

    def get_about_photo_url(self, obj):
        return obj.about_photo.url if obj.about_photo else None


class ClientSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model  = Client
        fields = ["id", "name", "role", "avatar_url", "order"]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None


class PortfolioPreviewSlotSerializer(serializers.ModelSerializer):
    project = serializers.SerializerMethodField()

    class Meta:
        model  = PortfolioPreviewSlot
        fields = ["id", "device", "order", "project"]

    def get_project(self, obj):
        return ProjectSerializer(obj.project).data


class ProjectSerializer(serializers.ModelSerializer):
    images        = ProjectImageSerializer(many=True, read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = [
            "id", "title", "category", "sub_type", "order", "images",
            "youtube_url", "yt_title", "yt_published", "yt_views", "yt_thumbnail",
            "thumbnail_url",
        ]

    def get_thumbnail_url(self, obj):
        return obj.thumbnail.url if obj.thumbnail else None


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BlogPost
        fields = ["id", "slug", "title", "description", "category", "thumbnail", "published_at"]


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BlogPost
        fields = ["id", "slug", "title", "description", "category", "thumbnail", "content", "published_at"]
