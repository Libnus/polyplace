from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from users.models import Role

import copy

class Building(models.Model):
    building_name = models.CharField(default="", max_length=30)
    num_floors = models.IntegerField(default=1)

    # active_hours_template = models.OneToOneField('Hours', on_delete=models.SET_NULL, null=True)
    # hours_templates = models.ManyToManyField(Hours, related_name='inactive_templates', null=True, blank=True) # hours_templates includes the active template

    write_roles = models.ManyToManyField(Role, related_name='building_write_roles', blank=True)
    roles = models.ManyToManyField(Role, related_name='building_roles', blank=True)

    reservations_hidden = models.BooleanField(default=False, blank=True)
    force_hidden = models.BooleanField(default=False, blank=True)

    #hours = models.ForeignKey(Hours, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.force_hidden:
            self.reservations_hidden = True
        super(Building, self).save(*args, **kwargs)

@receiver(post_save, sender=Building)
def post(sender, instance, *args, **kwargs):
    if Role.objects.get(role="admin") not in instance.roles.all():
        instance.roles.add(Role.objects.get(role="admin"))

    if Role.objects.get(role="admin") not in instance.write_roles.all():
        instance.write_roles.add(Role.objects.get(role="admin"))

class TimeRange(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()

# ;)
class Hours(models.Model):
    template_name = models.CharField(default="", blank=True, max_length=20)

    is_active = models.BooleanField(default=False)

    iso_week = models.IntegerField(null=True, blank=True) # if the week_start is null then its a template
    building = models.ForeignKey('Building', on_delete=models.CASCADE, blank=True, null=True)

    sunday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='sunday_hours')
    monday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='monday_hours')
    tuesday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='tuesday_hours')
    wednesday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='wednesday_hours')
    thursday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='thursday_hours')
    friday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='friday_hours')
    saturday_hours = models.ManyToManyField(TimeRange, blank=True, related_name='saturday_hours')

    def destroy(self):
        hours_m2m = {str(field.name):list(getattr(self, field.name).all()) for field in self._meta.get_fields() if isinstance(field, models.ManyToManyField)}
        for hour in hours_m2m:
            for time_range in hours_m2m[hour]: time_range.delete()
        self.delete()

def get_or_create_hours(building_pk, iso_week):
    print(building_pk, iso_week)

    # check if hours exist for week
    if not Hours.objects.filter(iso_week=iso_week, building=building_pk).exists():
        # if not then create the week based on building template
        if Hours.objects.filter(iso_week=None, building=building_pk).exists():
            print(Hours.objects.get(iso_week=None, building=building_pk).sunday_hours.all())
            new_hours = Hours.objects.get(iso_week=None, building=building_pk)
            new_hours.pk = None
            new_hours.iso_week = iso_week
            new_hours.save()
            return new_hours

        else: return False

    return Hours.objects.get(iso_week=iso_week, building=building_pk)

# data associated with the floor
class Floor(models.Model):
    floor_num = models.CharField(default="", max_length=5)
    num_rooms = models.IntegerField(default=0)
    color = models.CharField(default="#FF8C00", max_length=7)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)

    reservations_hidden = models.BooleanField(default=False, blank=True)
    force_hidden = models.BooleanField(default=False, blank=True)

    write_roles = models.ManyToManyField(Role, blank=True, related_name='floor_write_roles')
    roles = models.ManyToManyField(Role,blank=True, related_name='floor_roles')

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

    if instance.write_roles.all().count() == 0:
        instance.write_roles.add(*[role.id for role in instance.building.write_roles.all()])


# data associated with the room
class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    room_num = models.CharField(max_length=5)
    room_status = models

    write_roles = models.ManyToManyField(Role, blank=True, related_name='room_write_roles')
    roles = models.ManyToManyField(Role,blank=True, related_name='room_roles')
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

    if instance.write_roles.all().count() == 0:
        instance.write_roles.add(*[role.id for role in instance.floor.write_roles.all()])
