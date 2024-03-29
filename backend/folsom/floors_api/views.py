from django.shortcuts import render
from django.core.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework import viewsets
from rest_framework import status

from floors.models import Building, Room, Floor
from reservations.models import Reservation
from .serializers import BuildingSerializer, FloorSerializer, RoomSerializer

from shibboleth.utils import check_token

class BuildingViewSet(viewsets.ViewSet):
    """
    A viewset for Building model
    """
    def list(self,request):
        if check_token(request) == False:
            raise PermissionDenied()
        return Response(BuildingSerializer(Building.objects.all(),many=True).data)

class FloorViewSet(viewsets.ViewSet):
    """
    A viewset for Floor model
    """
    def list(self, request):
        if check_token(request) == False:
            raise PermissionDenied()
        return Response(FloorSerializer(Floor.objects.all(),many=True).data)

    def retrieve(self,request,pk=None):
        if check_token(request) == False:
            raise PermissionDenied()
        floor = Floor.objects.filter(building=pk)
        return Response(FloorSerializer(floor,many=True).data)

class RoomViewSet(viewsets.ViewSet):
    # get all rooms
    def list(self, request):
        if check_token(request) == False:
            raise PermissionDenied()
        return Response(RoomSerializer(Room.objects.all(),many=True).data)

    # retrieves a room with a particular floor number
    def retrieve(self,request,pk=None):
        if check_token(request) == False:
            raise PermissionDenied()
        rooms = Room.objects.filter(floor=pk)
        return Response(RoomSerializer(rooms,many=True).data)
