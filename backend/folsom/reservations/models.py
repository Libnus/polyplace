from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

from datetime import datetime
from floors.models import Room
from reservations.tasks import expired

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

@receiver(post_save, sender=Reservation)
def post(sender, instance, *args, **kawrgs):
    # add a celery task to move this reservation to history
    expired.apply_async(args=[instance.id], eta=instance.end_time)

# model that holds reservations for a week
class WeekContainer(models.Model):
    # start and end dates of the week
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    reservations = models.ManyToManyField(Reservation, blank=True)
