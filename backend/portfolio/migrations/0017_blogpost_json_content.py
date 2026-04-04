import json
from django.db import migrations, models


def convert_to_blocks(apps, schema_editor):
    BlogPost = apps.get_model("portfolio", "BlogPost")
    for post in BlogPost.objects.all():
        for field in ("content", "content_en"):
            raw = getattr(post, field) or ""
            if not raw:
                setattr(post, field, json.dumps([]))
                continue
            try:
                val = json.loads(raw)
                if not isinstance(val, list):
                    setattr(post, field, json.dumps([{"type": "paragraph", "text": raw}]))
            except (json.JSONDecodeError, TypeError):
                setattr(post, field, json.dumps([{"type": "paragraph", "text": raw}]))
        post.save()


def revert_blocks(apps, schema_editor):
    BlogPost = apps.get_model("portfolio", "BlogPost")
    for post in BlogPost.objects.all():
        for field in ("content", "content_en"):
            raw = getattr(post, field) or "[]"
            try:
                blocks = json.loads(raw)
                if isinstance(blocks, list):
                    texts = [b.get("text", "") for b in blocks if isinstance(b, dict) and b.get("type") == "paragraph"]
                    setattr(post, field, "\n\n".join(texts))
            except Exception:
                pass
        post.save()


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0016_blogpost_content_en_blogpost_description_en_and_more"),
    ]

    operations = [
        # Convert existing text rows to JSON arrays first, then alter the column type
        migrations.RunPython(convert_to_blocks, revert_blocks),
        migrations.AlterField(
            model_name="blogpost",
            name="content",
            field=models.JSONField(
                default=list,
                verbose_name="Contenu FR",
                help_text=(
                    'Liste de blocs. Types :\n'
                    '{"type":"heading","text":"TITRE"}\n'
                    '{"type":"paragraph","text":"Texte avec **gras** et *violet*"}\n'
                    '{"type":"image","url":"https://...","alt":"optionnel"}\n'
                    '{"type":"link","text":"Texte du lien","url":"https://..."}'
                ),
            ),
        ),
        migrations.AlterField(
            model_name="blogpost",
            name="content_en",
            field=models.JSONField(
                blank=True,
                default=list,
                verbose_name="Contenu EN",
                help_text="Same block format as content FR.",
            ),
        ),
    ]
