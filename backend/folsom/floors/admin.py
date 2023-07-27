from django.contrib import admin

from .models import Building, Room, Floor, Hours, TimeRange
from reservations.models import Reservation

admin.site.register(Floor)
admin.site.register(Hours)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(Building)
admin.site.register(TimeRange)
