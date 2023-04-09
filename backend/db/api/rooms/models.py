from django.db import models
from datetime import datetime

# data associated with the floor
'''
Data:
    floor_num     : Floor number
    num_rooms : Number of available rooms
'''
class Floor(models.Model):
    floor_num = models.IntegerField(default=0)
    num_rooms = models.IntegerField(default=0)

# data associated with reservation
class Reservation(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    start_time = models.DateTimeField(auto_now_add=True,blank=True)
    end_time = models.DateTimeField()

    def time_left(self):
        return self.end_time.time() - datetime.now().time()

def get_default_reservation_status():
    return Reservation.objects.get(name="")[0]

# data associated with the room
'''
Data:
    floor       : The floor the room is on
    room_num    : Room Number
    reservation : A reservation associated with this room. Will be blank if room is empty
'''
class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    room_num = models.CharField(max_length=5)
    reservation = models.ForeignKey(Reservation, blank=True, null=True, on_delete=models.CASCADE)

    # check if room is empty
    def is_empty(self):
        return self.reservation is None
