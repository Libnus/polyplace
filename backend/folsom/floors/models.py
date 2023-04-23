from django.db import models

class Building(models.Model):
    building_name = models.CharField(default="", max_length=30)
    num_floors = models.IntegerField(default=0)

# data associated with the floor
class Floor(models.Model):
    floor_num = models.CharField(default="", max_length=5)
    num_rooms = models.IntegerField(default=0)
    color = models.CharField(default="#FF8C00", max_length=7)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)

# data associated with the room
class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    room_num = models.CharField(max_length=5)
    room_status = models
