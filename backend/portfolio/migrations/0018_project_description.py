from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0017_blogpost_json_content"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="description",
            field=models.TextField(
                blank=True,
                default="",
                verbose_name="Description SEO",
                help_text="Optionnel — utilisé uniquement dans les meta tags pour Google (max 160 caractères recommandé)",
            ),
        ),
    ]
