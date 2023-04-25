from django.contrib import admin

from .models import Building, Room, Floor
from reservations.models import Reservation

admin.site.register(Floor)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(Building)
