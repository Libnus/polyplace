# Generated by Django 3.2.8 on 2023-04-08 18:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0001_initial'),
        ('floors', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='reservation',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='reservations.reservation'),
        ),
    ]
