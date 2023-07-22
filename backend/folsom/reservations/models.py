from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

from datetime import datetime
from floors.models import Room
from users.models import PolyUser


class Reservation(models.Model):
    user = models.ForeignKey(PolyUser, on_delete=models.CASCADE, null=True)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    event_name = models.CharField(max_length=20, default="")

    hidden = models.BooleanField(default=False)

    def time_left(self):
        current = datetime.now()
        diff = self.end_time.replace(tzinfo=None) - current
        return diff

    def save(self, *args, **kwargs):
        super(Reservation, self).save(*args, **kwargs)

@receiver(post_save, sender=Reservation)
def post(sender, instance, *args, **kwargs):
    if instance.room.force_hidden:
        instance.hidden = True

# model that holds reservations for a week
class WeekContainer(models.Model):
    # start and end dates of the week
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    reservations = models.ManyToManyField(Reservation, blank=True)
