# Generated by Django 3.2.8 on 2023-07-13 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='polyuser',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]
