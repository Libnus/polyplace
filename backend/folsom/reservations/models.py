from django.db import models
from datetime import datetime
from floors.models import Room


class Reservation(models.Model):
    #room = models.ForeignKey(Room, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    rin = models.CharField(max_length=9,default="")
    email = models.CharField(max_length=20,default="----@rpi.edu")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    event_name = models.CharField(max_length=20, default="")

    def time_left(self):
        current = datetime.now()
        diff = self.end_time.replace(tzinfo=None) - current
        return diff

# model that holds reservations for a week
class WeekContainer(models.Model):
    # start and end dates of the week
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    reservations = models.ManyToManyField(Reservation, blank=True)
