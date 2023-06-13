from django.shortcuts import render

from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action

from reservations.models import Reservation
from floors.models import Room
from .serializers import ReservationSerializer

import datetime

from .utils import check_reservation_time

class ReservationViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(ReservationSerializer(Reservation.objects.all(),many=True).data)

    # get reservations associated with room
    def retrieve(self, request, pk=None):
        return Response(ReservationSerializer(Reservation.objects.filter(room=pk),many=True).data)

    # get all reservations in a given week
    #
    # input: room and a week (the date the week started) to get reservations from
    # output: the reservations associated with a room from week
    @action(detail=True)
    def get_week(self, request, pk=None):


        # get the week of date
        parsed_date = [int(x) for x in request.query_params.get('date')[:-1].split('-')]
        print(parsed_date)
        week = datetime.date(parsed_date[2],parsed_date[0],parsed_date[1]).isocalendar()[1]

        all_reservations = Reservation.objects.filter(room=pk)

        reservations = []
        for reservation in all_reservations:
            print("current week vs week", week, reservation.start_time.isocalendar()[1])
            if reservation.start_time.isocalendar()[1] == week:
                reservations.append(reservation)

        return Response(ReservationSerializer(reservations,many=True).data)


    # create method creates a reservation then adds the reservation to the room
    def create(self,request,*args,**kwargs):
        if not Room.objects.filter(room_num=request.data['room']).exists(): # check that the room exists
            return Response({'message':"Conflict! Room doesn't exist!"},status=status.HTTP_409_CONFLICT)

        room = Room.objects.get(room_num=request.data['room'])

        if check_reservation_time(Reservation.objects.filter(room=room.id), (request.data['start_time'],request.data['end_time'])): # check if room has already been reserved
            return Response({'message':"Conflict! Room taken at time specified"},status=status.HTTP_409_CONFLICT)
        #
        # TODO students can make more than one reservation
        if Reservation.objects.filter(rin=request.data['rin']).exists():
            return Response({'message':"Conflict! Student already reserved a room!"},status=status.HTTP_409_CONFLICT)

        else:
            data = request.data
            data['room'] = room.id

            serializer = ReservationSerializer(data=data) # create the reservation
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data,status=status.HTTP_201_CREATED)
