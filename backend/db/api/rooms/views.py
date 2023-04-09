from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Room, Reservation, Floor
from .serializers import RoomSerializer, ReservationSerializer, FloorSerializer

@api_view(['GET'])
def getRoutes(request):

    routes=[
        {
            'Endpoint': '/rooms/',
            'method': 'GET',
            'body': None,
            'description': 'returns room data'
        },
        {
            'Endpoint': '/floor/',
            'method': 'GET',
            'body': None,
            'description': 'get all rooms associated with floor number'
        }
    ]

    return Response(routes)

@api_view(['GET'])
def getRooms(request):
    rooms = Room.objects.all()
    return Response(RoomSerializer(rooms,many=True).data)

# input floor number and return all rooms on that floor
@api_view(['GET'])
def getFloor(request, fnum):
    rooms = Room.objects.filter(floor=fnum)
    return Response(RoomSerializer(rooms,many=True).data)

@api_view(['GET'])
def getFloors(request):
    floors = Floor.objects.all()
    return Response(FloorSerializer(floor,many=True).data)
