from django.shortcuts import render
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.db import models

from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework import viewsets
from rest_framework import status

from users.models import PolyUser, Role

from shibboleth.utils import check_token

from floors.models import Hours, Building, Room, Floor, get_or_create_hours
from reservations.models import Reservation
from .serializers import BuildingSerializer, FloorSerializer, RoomSerializer, HoursSerializer, TimeRangeSerializer

from shibboleth.utils import check_token

from utils.utils import get_iso_week

import datetime
import copy

def serialize_time_ranges(times):
    serialized_ranges = []
    for time in times:
        time_range = TimeRangeSerializer(data=time)
        time_range.is_valid(raise_exception=True)
        serialized_ranges.append(time_range.save())
    return serialized_ranges

def save_hours(instance, hours):
    for day in hours:
        getattr(instance, day).add(*hours[day])

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

        roles = []
        for role in data['roles']:
            if Role.objects.filter(role=role['role']).exists():
                roles.append(Role.objects.get(role=role['role']).id)

        data.pop('roles', [])

        serializer = BuildingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        instance.roles.add(*roles)

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

    def retrieve(self, request, pk=None):
        token = check_token(request)
        if not token: raise PermissionDenied()
        token = token[1]

        building = Building.objects.get(pk=pk)

        # check user has permission to view building
        print(token)
        roles = PolyUser.objects.get(rcs=token['user']).roles.all()
        if len([role for role in roles if role in building.roles.all()]) == 0: raise PermissionDenied()

        return Response(BuildingSerializer(building, many=False).data)



    @action(detail=True, methods=['post'])
    def create_hours(self, request, pk=None): # create hours template for building
        # create new hours schedule
        data = request.data

        data['building'] = pk
        iso_week = get_iso_week(request.query_params.get('date'))
        print(iso_week, request.query_params.get('date'))
        data['iso_week'] = iso_week

        # delete existing week as we are overwriting it
        if Hours.objects.filter(building=pk, iso_week=iso_week).exists():
            Hours.objects.get(building=pk, iso_week=iso_week).destroy;
            # hours_m2m = {str(field.name):list(getattr(existing_hours,field.name).all()) for field in existing_hours._meta.get_fields() if isinstance(field, models.ManyToManyField)}
            # for hour in hours_m2m:
            #     for time_range in hours_m2m[hour]: time_range.delete()
            # Hours.objects.get(building=pk, iso_week=iso_week).delete()

        # serialize time range data
        deserialized_hours = {}

        for day in data['hours']:
            deserialized_hours[day] = serialize_time_ranges(data['hours'][day])

        data.pop('hours')

        hours = HoursSerializer(data=data)
        hours.is_valid(raise_exception=True)
        hours = hours.save()

        # for day in deserialized_hours:
        #     getattr(hours, day).add(*deserialized_hours[day])
        save_hours(hours, deserialized_hours)

        # if we are creating a new template
        if request.query_params.get('create_template') or Hours.objects.filter(iso_week=None, building=pk).all().length == 0:
            if request.query_params.get('overwrite_templates'):
                Hours.objects.filter(Q(building=pk) & ~Q(iso_week=iso_week)).delete() # delete all weeks using previous templates

            # remove old template as current template
            if Hours.objects.filter(iso_week=None, building=pk).exists():
                Hours.objects.get(iso_week=None, building=pk).building = None # don't delete but make it point to null

            # create new template and make it point to building pk
            hours_copy = Hours.objects.get(iso_week=iso_week, building=pk)

            hours_copy.pk = None
            hours_copy.iso_week = None
            hours_copy.save()
            save_hours(hours_copy, deserialized_hours)
            print(hours_copy.id, hours_copy.sunday_hours.all())

        return Response(status=status.HTTP_201_CREATED)


    @action(detail=True)
    def get_hours(self, request, pk=None):
        if check_token(request) == False:
            raise PermissionDenied()

        parsed_date = [int(x) for x in request.query_params.get('date')[:-1].split('-')]
        template_name = request.query_params.get('template')
        if template_name != None: template_name = template_name[:-1]
        print(template_name)

        date = datetime.date(parsed_date[2],parsed_date[0],parsed_date[1])
        iso_week = date.isocalendar()[1]
        if(date.weekday() == 6): iso_week+=1
        print(iso_week)

        if template_name != None:
            if Hours.objects.filter(template_name=template_name).exists():
                if Hours.objects.filter(iso_week=iso_week,building=pk).exists():
                    Hours.objects.get(iso_week=iso_week,building=pk).destroy()

        # check if hours exist for week
        if not Hours.objects.filter(iso_week=iso_week, building=pk).exists() or template_name != None:
            # if not then create the week based on building template
            if Hours.objects.filter(iso_week=None, building=pk).exists():
                hours = Hours.objects.get(iso_week=None, building=pk)
                hours_copy = Hours.objects.get(iso_week=None, building=pk)

                hours_copy.pk = None
                if template_name != None: hours_copy.template_name = template_name
                hours_copy.iso_week = iso_week
                hours_copy.save()

                # copy all the m2m fields
                hours_m2m = {str(field.name):list(getattr(hours,field.name).all()) for field in hours._meta.get_fields() if isinstance(field, models.ManyToManyField)}
                save_hours(hours_copy, hours_m2m)

                return Response(HoursSerializer(hours_copy, many=False).data)

            else: return Response('') # building doesn't have an hours template yet
        return Response(HoursSerializer(Hours.objects.get(iso_week=iso_week, building=pk),many=False).data)


class FloorViewSet(viewsets.ViewSet):
    """
    A viewset for Floor model
    """
    def create(self, request, *args, **kwags):
        token = check_token(request)
        if not token: raise PermissionDenied()
        token = token[1]
        user = PolyUser.objects.get(rcs=token['user'])

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
        user = PolyUser.objects.get(rcs=token['user'])

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

    # @action(detail=True, methods=['get'])
    # def get_roles(self, request, pk=None):
    #     token = check_token(request)
    #     if token == False: raise PermissionDenied()
    #     token=token[1]

    #     room = Room.objects.get(pk=pk)

    #     # check user has permission to close room
    #     user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()

    #     if(len([role for role in user_roles if role in room.write_roles.all()]) > 0):
    #         permissions = {}
    #         for role in room.write_roles.all():
    #             permissions[role.role] = {}
    #             permissions[role.role]['write'] = True
    #             permissions[role.role]['view'] = True
    #         for role in room.roles.all():
    #             if role.role not in permissions:
    #                 permissions[role.role] = {}
    #                 permissions[role.role]['write'] = False
    #             permissions[role.role]['view'] = True

    #         return Response(permissions)

    #     else: raise PermissionDenied()

    @action(detail=True, methods=['patch'])
    def close_room(self, request, pk=None):
        token = check_token(request)
        if token == False: raise PermissionDenied()
        token=token[1]

        room = Room.objects.get(pk=pk)

        # check user has permission to close room
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()
        if len([role for role in user_roles if role in room.write_roles.all()]) == 0: raise PermissionDenied()

        room.closed = not room.closed
        room.save()

        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def update_roles(self, request, pk=None):
        token = check_token(request)
        if token == False: raise PermissionDenied()
        token = token[1]

        room = Room.objects.get(pk=pk)
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()
        if len([role for role in user_roles if role in room.write_roles.all()]) == 0: raise PermissionDenied()

        new_roles = request.data

        # go through all roles and check permissions and update if needed
        for role in new_roles:
            role_instance = Role.objects.get(role=role)
            if new_roles[role]['write']:
                if role_instance not in room.write_roles.all():
                    room.write_roles.add(role_instance)
                    room.roles.add(role_instance)

            else: # otherwise confirm the role doesn't have write permissions
                if role_instance in room.write_roles.all():
                    room.write_roles.remove(role_instance)
                if new_roles[role]['view']: # we have view permissions
                    room.roles.add(role_instance)
                else: # check if view permissions have been removed
                    if role_instance in room.roles.all():
                        room.roles.remove(role_instance)
        room.save()

        return Response(status=status.HTTP_200_OK)
