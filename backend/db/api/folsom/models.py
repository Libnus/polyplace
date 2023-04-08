from django.db import models

# data associated with the room
'''
Data:
    room       : Room Number
    first_name : First Name of student reserving
    last_name  : Last Name of student reserving
    start_time : Start time of reservation
    end_time   : End time of reservation
    time_left  : Amount of the time left of reservation

'''
class Room(models.Model):
    room = models.CharField(max_length=5)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    start_time = models.TimeField()
    end_time = models.TimeField()
    time_left = end_time - datetime.datetime.now().time()


# data associated with the floor
'''
Data:
    floor_num     : Floor number
    rooms         : Array of rooms on floor
    num_available : Number of available rooms
'''
class Floor(models.Model):
    floor_num = models.IntegerField(default=0)
    rooms = models.ArrayField(Room)
    num_available = models.IntegerField(default=0)

# data associated with reservation
class Reservation(models.Model):
    first_name = models.CharField(max_length=20)
