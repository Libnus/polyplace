# Generated by Django 3.2.8 on 2023-04-09 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('floors', '0002_alter_room_reservation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='floor',
            name='floor_num',
            field=models.CharField(default='', max_length=5),
        ),
    ]