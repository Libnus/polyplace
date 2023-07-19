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
        date = datetime.date(parsed_date[2],parsed_date[0],parsed_date[1])
        week = date.isocalendar()[1]

        # but wait! python starts the week on monday (:
        # check if the day inputted is sunday, if so, consider it the next week already
        if date.weekday() == 6: week+=1

        all_reservations = Reservation.objects.filter(room=pk)

        reservations = []
        for reservation in all_reservations:
            reservation_week = reservation.start_time.isocalendar()[1]
            # maybe there is a better way to solve this problem of the week starting on monday
            if reservation.start_time.weekday() == 6: reservation_week+=1

            if reservation_week == week:
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
        # if Reservation.objects.filter(rin=request.data['rin']).exists():
        #     return Response({'message':"Conflict! Student already reserved a room!"},status=status.HTTP_409_CONFLICT)

        else:
            data = request.data
            data['room'] = room.id

            serializer = ReservationSerializer(data=data) # create the reservation
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({'id': serializer.data['id']}, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        if not Room.objects.filter(room_num=request.data['room']).exists(): # check that the room exists
            return Response({'message':"Conflict! Room doesn't exist!"},status=status.HTTP_409_CONFLICT)

        room = Room.objects.get(room_num=request.data['room'])

        if check_reservation_time(Reservation.objects.filter(room=room.id), (request.data['start_time'],request.data['end_time'])): # check if room has already been reserved
            return Response({'message':"Conflict! Room taken at time specified"},status=status.HTTP_409_CONFLICT)
        #
        # TODO students can make more than one reservation
        # if Reservation.objects.filter(rin=request.data['rin']).exists():
        #     return Response({'message':"Conflict! Student already reserved a room!"},status=status.HTTP_409_CONFLICT)

        else:
            data = request.data
            data['room'] = room.id

            reservation = Reservation.objects.get(pk=pk)
            serializer = ReservationSerializer(reservation, data=data) # create the reservation
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data,status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        if not Reservation.objects.filter(pk=pk).exists():
            return Response({'message': "Reservation doesn't exist!"}, status=status.HTTP_404_NOT_FOUND)

        reservation = Reservation.objects.get(pk=pk)
        reservation.delete();
        return Response(status=status.HTTP_200_OK)
