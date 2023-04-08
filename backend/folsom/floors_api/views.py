from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from floors.models import Room, Floor
from reservations.models import Reservation
from .serializers import FloorSerializer, RoomSerializer

class FloorViewSet(viewsets.ModelViewSet):
    """
    A viewset for Floor model
    """

    queryset = Floor.objects.all()
    serializer_class = FloorSerializer

    def list(self, request):
        return Response(FloorSerializer(self.queryset,many=True).data)

    def retrieve(self,request,pk=None):
        floor = self.queryset.filter(floor_num=pk)
        return Response(self.serializer_class(floor,many=False).data)


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    # get all rooms
    def list(self, request):
        return Response(self.serializer_class(self.queryset,many=True).data)

    # retrieves a room with a particular floor number
    def retrieve(self,request,pk=None):
        rooms = self.queryset.filter(floor=pk)
        return Response(self.serializer_class(rooms,many=True).data)
