from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from reservations.models import Reservation
from floors.models import Room
from .serializers import ReservationSerializer

from .utils import check_reservation_time

class ReservationViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(ReservationSerializer(Reservation.objects.all(),many=True).data)

    # get reservation associated with room
    def retrieve(self, request, pk=None):
        reservation = Reservation.objects.filter(id=pk)
        return Response(ReservationSerializer(reservation,many=True).data)

    # create method creates a reservation then adds the reservation to the room
    def create(self,request,*args,**kwargs):
        if not Room.objects.filter(room_num=request.data['room_num']).exists(): # check that the room exists
            return Response({'message':"Conflict! Room doesn't exist!"},status=status.HTTP_409_CONFLICT)
       
        if check_reservation_time(Room.objects.get(room_num=request.data['room_num']).reservations, (request.data['start_time'],request.data['end_time'])): # check if room has already been reserved
            return Response({'message':"Conflict! Room taken at time specified"},status=status.HTTP_409_CONFLICT)
        
        if Reservation.objects.filter(rin=request.data['rin']).exists():
            return Response({'message':"Conflict! Student already reserved a room!"},status=status.HTTP_409_CONFLICT)

        else:
            data = request.data
            room = data["room_num"] # get the room number
            print(room)
            data.pop("room_num")

            serializer = ReservationSerializer(data=request.data) # create the reservation
            serializer.is_valid(raise_exception=True)
            new_reservation = serializer.save()

            # finally, add reservation to the room_num
            room = Room.objects.get(room_num=room)
            room.reservations.add(new_reservation)
            room.save()

            return Response(serializer.data,status=status.HTTP_201_CREATED)

