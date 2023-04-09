from django.contrib import admin

from .models import Room
from .models import Floor
from .models import Reservation

admin.site.register(Room)
admin.site.register(Floor)
admin.site.register(Reservation)
