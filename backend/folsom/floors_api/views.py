from django.shortcuts import render
from django.core.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework import viewsets
from rest_framework import status

from users.models import PolyUser, Role

from shibboleth.utils import check_token

from floors.models import Hours, Building, Room, Floor
from reservations.models import Reservation
from .serializers import BuildingSerializer, FloorSerializer, RoomSerializer, HoursSerializer

from shibboleth.utils import check_token

class BuildingViewSet(viewsets.ViewSet):
    """
    A viewset for Building model
    """
    def create(self, request, *args, **kwargs):
        token = check_token(request)
        if not token: raise PermissionDenied()
        token = token[1]
        user = PolyUser.objects.get(rcs=token['user'])

        # check permissions
        if Role.objects.get(role="admin") not in user.roles.all(): raise PermissionDenied()

        data = request.data

        # if we didn't recieve a pk then serialize hours
        if isinstance(data['hours'],dict):
            hours = HoursSerializer(data=data['hours'])
            hours.is_valid(raise_exception=True)
            hours.save()
            data['hours'] = hours.data['id']

        
        serializer = BuildingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)

    def list(self,request):
        token = check_token(request)
        if token == False:
            raise PermissionDenied()
        token = token[1]
        roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        print(roles)

        # fetch all buildings user has access to based on their roles
        buildings = Building.objects.all()
        viewable_buildings = []
        for building in buildings:
            if len([role for role in roles if role in building.roles.all()]) > 0:
                viewable_buildings.append(building)

        return Response(BuildingSerializer(viewable_buildings,many=True).data)

class FloorViewSet(viewsets.ViewSet):
    """
    A viewset for Floor model
    """
    def create(self, request, *args, **kwags):
        token = check_token(request)
        if not token: raise PermissionDenied()
        token = token[1]
        user = PolyUser.objects.get(rcs=token['rcs'])

        # check permissions
        if Role.objects.get(role="admin") not in user.roles.all(): raise PermissionDenied()

        serializer = FloorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)

    
    def list(self, request):
        token = check_token(request)
        if token == False:
            raise PermissionDenied()
        token = token[1]
        roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        floors = Floor.objects.all()
        viewable_floors = []
        for floor in floors:
            if len([role for role in roles if role in floor.roles.all()]) > 0:
                viewable_floors.append(floor)

        return Response(FloorSerializer(viewable_floors,many=True).data)

    def retrieve(self,request,pk=None):
        token = check_token(request)
        if token == False:
            raise PermissionDenied()
        token = token[1]
        roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        floor = Floor.objects.get(building=pk)

        # check that the user has permission to view this floor
        if len([role for role in roles if role in floor.roles.all()]) == 0:
            raise PermissionDenied()
        return Response(FloorSerializer(floor,many=False).data)


class RoomViewSet(viewsets.ViewSet):
    def create(self, request, *args, **kwargs):
        token = check_token(request)
        if not token: raise PermissionDenied()
        token = token[1]
        user = PolyUser.objects.get(rcs=token['rcs'])

        # check permissions
        if Role.objects.get(role="admin") not in user.roles.all(): raise PermissionDenied()

        serializer = RoomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)

    # get all rooms
    def list(self, request):
        if check_token(request) == False:
            raise PermissionDenied()
        return Response(RoomSerializer(Room.objects.all(),many=True).data)

    # retrieves a room with a particular floor number
    def retrieve(self,request,pk=None):
        token = check_token(request)
        if token == False:
            raise PermissionDenied()
        token = token[1]
        roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        rooms = Room.objects.filter(floor=pk)
        viewable_rooms = []
        for room in rooms:
            if len([role for role in roles if role in room.roles.all()]) > 0:
                viewable_rooms.append(room)


        return Response(RoomSerializer(viewable_rooms,many=True).data)
