from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from users.models import Role

# ;)
class Hours(models.Model):
    monday_start = models.TimeField(null=True, blank=True)
    monday_end = models.TimeField(null=True, blank=True)

    tuesday_start = models.TimeField(null=True, blank=True)
    tuesday_end = models.TimeField(null=True, blank=True)

    tuesday_start = models.TimeField(null=True, blank=True)
    tuesday_end = models.TimeField(null=True, blank=True)

    wednesday_start = models.TimeField(null=True, blank=True)
    wednesday_end = models.TimeField(null=True, blank=True)

    thursday_start = models.TimeField(null=True, blank=True)
    thursday_end = models.TimeField(null=True, blank=True)

    friday_start = models.TimeField(null=True, blank=True)
    friday_end = models.TimeField(null=True, blank=True)

    saturday_start = models.TimeField(null=True, blank=True)
    saturday_end = models.TimeField(null=True, blank=True)

    sunday_start = models.TimeField(null=True, blank=True)
    sunday_end = models.TimeField(null=True, blank=True)


class Building(models.Model):
    building_name = models.CharField(default="", max_length=30)
    num_floors = models.IntegerField(default=0)
    roles = models.ManyToManyField(Role)

    reservations_hidden = models.BooleanField(default=False, blank=True)
    force_hidden = models.BooleanField(default=False, blank=True)

    hours = models.ForeignKey(Hours, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.force_hidden:
            self.reservations_hidden = True
        super(Building, self).save(*args, **kwargs)

@receiver(post_save, sender=Building)
def post(sender, instance, *args, **kwargs):
    if Role.objects.get(role="admin") not in instance.roles.all():
        instance.roles.add(Role.objects.get(role="admin"))

# data associated with the floor
class Floor(models.Model):
    floor_num = models.CharField(default="", max_length=5)
    num_rooms = models.IntegerField(default=0)
    color = models.CharField(default="#FF8C00", max_length=7)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)

    reservations_hidden = models.BooleanField(default=False, blank=True)
    force_hidden = models.BooleanField(default=False, blank=True)

    roles = models.ManyToManyField(Role,blank=True)

    def save(self, *args, **kwargs):
        if self.building.force_hidden:
            self.force_hidden = True
            self.reservations_hidden = True
        elif self.building.reservations_hidden:
            self.reservations_hidden = True


        super(Floor, self).save(*args, **kwargs)

@receiver(post_save, sender=Floor)
def post(sender, instance, *args, **kwargs):
    #inherit permissions from building if none are specified
    if instance.roles.all().count() == 0:
        instance.roles.add(*[role.id for role in instance.building.roles.all()])

# data associated with the room
class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    room_num = models.CharField(max_length=5)
    room_status = models

    roles = models.ManyToManyField(Role, blank=True)
    closed = models.BooleanField(default=False, blank=True)

    reservations_hidden = models.BooleanField(default=False, blank=True)
    force_hidden = models.BooleanField(default=False, blank=True)

    def save(self, *args, **kwargs):
        if self.floor.force_hidden:
            self.force_hidden = True
            self.reservations_hidden = True
        elif self.floor.reservations_hidden:
            self.reservations_hidden = True


        super(Room, self).save(*args, **kwargs)


@receiver(post_save, sender=Room)
def post(sender, instance, *args, **kwargs):
    #inherit permissions from building if none are specified
    if instance.roles.all().count() == 0:
        instance.roles.add(*[role.id for role in instance.floor.roles.all()])
