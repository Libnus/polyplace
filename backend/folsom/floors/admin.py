from django.contrib import admin

from .models import Room, Floor
from .models import Building
from reservations.models import Reservation

admin.site.register(Floor)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(Building)
