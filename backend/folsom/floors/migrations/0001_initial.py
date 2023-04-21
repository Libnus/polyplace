# Generated by Django 4.2 on 2023-04-20 14:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('reservations', '0002_alter_reservation_start_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('building_name', models.CharField(default='', max_length=10)),
                ('num_floors', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Floor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('floor_num', models.CharField(default='', max_length=5)),
                ('num_rooms', models.IntegerField(default=0)),
                ('color', models.CharField(default='#FF8C00', max_length=7)),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='floors.building')),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_num', models.CharField(max_length=5)),
                ('floor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='floors.floor')),
                ('reservations', models.ManyToManyField(blank=True, to='reservations.reservation')),
            ],
        ),
    ]
