# Generated by Django 3.2.8 on 2023-07-13 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_polyuser_is_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='polyuser',
            name='email',
            field=models.EmailField(max_length=15, verbose_name='email address'),
        ),
        migrations.AlterField(
            model_name='polyuser',
            name='rcs',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]
