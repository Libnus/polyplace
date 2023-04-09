from django.db import models
from reservations.models import Reservation

# data associated with the floor
'''
    floor_num : Floor number
    num_rooms : Number of available rooms
'''
class Floor(models.Model):
    floor_num = models.CharField(default="", max_length=5)
    num_rooms = models.IntegerField(default=0)
    color = models.CharField(default="#FF8C00", max_length=7)

# data associated with the room
'''
    floor       : The floor the room is on
    room_num    : Room Number
    reservation : A reservation associated with this room. Will be blank if room is empty
'''

class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    room_num = models.CharField(max_length=5)
    reservation = models.ForeignKey(Reservation, blank=True, null=True, on_delete=models.CASCADE)
