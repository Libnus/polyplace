# Generated by Django 4.2 on 2023-04-20 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='start_time',
            field=models.DateTimeField(),
        ),
    ]