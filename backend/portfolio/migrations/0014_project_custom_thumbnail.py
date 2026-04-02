from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0013_remove_minipack_subtype"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="thumbnail",
            field=models.ImageField(blank=True, null=True, upload_to="thumbnails/", verbose_name="Miniature personnalisée"),
        ),
    ]
