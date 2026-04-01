from django.db import migrations


def minipack_to_miniature(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    Project.objects.filter(sub_type="minipack").update(sub_type="miniature")


def miniature_to_minipack(apps, schema_editor):
    # Reverse: not perfectly reversible but safe enough
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0012_add_portfolio_preview_slot"),
    ]

    operations = [
        migrations.RunPython(minipack_to_miniature, miniature_to_minipack),
    ]
