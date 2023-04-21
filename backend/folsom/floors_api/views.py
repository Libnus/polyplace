from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from floors.models import Room, Floor, Building
from reservations.models import Reservation
from .serializers import BuildingSerializer, FloorSerializer, RoomSerializer

class BuildingViewSet(viewsets.ViewSet):
    """
    A viewset for Building model
    """
    def list(self, request):
        return Response(BuildingSerializer(Building.objects.all(),many=True).data)

class FloorViewSet(viewsets.ViewSet):
    """
    A viewset for Floor model
    """
    def list(self, request):
        return Response(FloorSerializer(Floor.objects.all(),many=True).data)

    def retrieve(self,request,pk=None):
        floor = Floor.objects.filter(building=pk)
        return Response(FloorSerializer(floor,many=True).data)



class RoomViewSet(viewsets.ViewSet):
    # get all rooms
    def list(self, request):
        return Response(RoomSerializer(Room.objects.all(),many=True).data)

    # retrieves a room with a particular floor number
    def retrieve(self,request,pk=None):
        rooms = Room.objects.filter(floor=pk)
        return Response(RoomSerializer(rooms,many=True).data)
