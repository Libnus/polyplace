from django.urls import path

from . import views

urlpatterns = [
    path("", views.getRoutes,name="getRoutes"),
    path("rooms/",views.getRooms,name="rooms"),
    path("rooms/<str:fnum>/", views.getFloor,name="floor"),
    path("floors/",views.getFloors,name="floors"),
]
