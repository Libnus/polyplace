from django.db import models

from rest_framework import serializers
from floors.models import Building, Floor, Room, Hours, TimeRange
from users.models import PolyUser, Role
from datetime import datetime, timezone, timedelta
from reservations.models import Reservation


from users.serializers import RoleSerializer

from shibboleth.utils import check_token

class TimeRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRange
        fields = "__all__"

    # def to_representation(self, instance):
    #     return [serializers.TimeField(instance.start_time), serializers.TimeField(instance.end_time)]


class HoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hours
        fields = "__all__"

        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        hours_m2m = {str(field.name):list(getattr(instance,field.name).all()) for field in instance._meta.get_fields() if isinstance(field, models.ManyToManyField)}
        for hours in hours_m2m:
            representation[hours] = []
            for hour in hours_m2m[hours]:
                representation[hours].append(TimeRangeSerializer(hour,many=False).data)
                print(TimeRangeSerializer(hour,many=False).data)
        return representation

class BuildingSerializer(serializers.ModelSerializer):
    can_edit = serializers.SerializerMethodField('get_edit_roles')

    def get_edit_roles(self, instance):
        request = self.context.get('request')

        # assume the user has already been authorized
        token = check_token(request)[1]
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        # if any of the users roles are permitted editors
        if(len([role for role in user_roles if role in instance.write_roles.all()]) > 0):
            return True
        return False

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['hours_templates'] = []
        for template in Hours.objects.filter(iso_week=None, building=instance.pk):
            representation['hours_templates'].append(template.template_name)

        return representation

    class Meta:
        model = Building
        exclude = ('reservations_hidden', )

class FloorSerializer(serializers.ModelSerializer):
    can_edit = serializers.SerializerMethodField('get_edit_roles')

    def get_edit_roles(self, instance):
        request = self.context.get('request')

        # assume the user has already been authorized
        token = check_token(request)[1]
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        # if any of the users roles are permitted editors
        if(len([role for role in user_roles if role in instance.write_roles.all()]) > 0):
            return True
        return False

    class Meta:
        model = Floor
        exclude = ('roles', 'write_roles',)

# find the next available time a room will be available given a list of events and the last event. 
# A room is next available if the next booking is not within 30 MINUTES of the last event
def get_next_free_time(last_event, events):
    if(len(events) == 0): return last_event

    current_event = min(events, key=lambda time:time[0])
    while last_event < current_event[0]+timedelta(minutes=30):
        last_event = current_event[1]
        events.remove(current_event)

        if(len(events) == 0): return last_event
        current_event = min(events, key=lambda time:time[0])

    return last_event


class RoomSerializer(serializers.ModelSerializer):
    room_status = serializers.SerializerMethodField('get_room_status')
    location = serializers.SerializerMethodField('get_location')
    can_edit = serializers.SerializerMethodField('get_edit_roles')

    def get_edit_roles(self, instance):
        request = self.context.get('request')

        # assume the user has already been authorized
        token = check_token(request)[1]
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        # if any of the users roles are permitted editors
        if(len([role for role in user_roles if role in instance.write_roles.all()]) > 0):
            return True
        return False

    def get_location(self, room):
        return room.floor.building.building_name + ", " + room.floor.floor_num + " Floor"

    # returns the current status of a room in a json where the first element is the status and second is the time this status ends:
    # examples:
    # {status: 'free', time: '10:30 A.M.'}        -- room is free until 10:30
    # {status: 'reserved', time: '3:30 P.M.'}     -- room is reserved until 3:30
    # {status: 'not_bookable', time: '1:00 P.M.'} -- room is free but not bookable as there is an upcoming event within 30 minutes.
    # {status: 'closed', time: ''}                -- room is closed with no time specified
    def get_room_status(self, room):
        state = {'status': "", 'time': ""}

        # loop over the reservations and find the event closest to the current time
        current_time = datetime.now(timezone.utc)
        print("current time", current_time)

        events = []
        for reservation in Reservation.objects.filter(room=room.id):
            print(reservation.end_time)
            if reservation.end_time > current_time:
                events.append((reservation.start_time,reservation.end_time, reservation.event_name))

        if(len(events) == 0):
            state['status'] = "free"
            state['time'] = ""
            state['event'] = ""
            return state

        min_event = min(events, key=lambda time:time[0])
        time_format = "%I:%M %p"
        print(min_event[0])

        # find the status of the event
        if min_event == None:
            state['status'] = "closed"
            state['time'] = ""

        elif min_event[0] < current_time:
            state['status'] = "reserved"
            events.remove(min_event)

            state['time'] = get_next_free_time(min_event[1],events).astimezone(timezone(timedelta(hours=-4))).strftime(time_format)

        elif min_event[0] < current_time+timedelta(minutes=30):
            state['status'] = "not_bookable"
            events.remove(min_event)
            state['time'] = get_next_free_time(min_event[1],events).astimezone(timezone(timedelta(hours=-4))).strftime(time_format)

        else:
            state['status'] = "free"
            if(current_time.day < min_event[0].day):
                state['time'] += min_event[0].strftime("%B") + ', ' + str(min_event[0].day) + ' @'
            state['time'] += min_event[0].astimezone(timezone(timedelta(hours=-4))).strftime(time_format)


        state['event'] = min_event[2]

        return state


    class Meta:
        model = Room
        exclude = ('roles', 'write_roles', )

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request')
        token = check_token(request)[1]
        user_roles = PolyUser.objects.get(rcs=token['user']).roles.all()

        # if any of the users roles are permitted editors
        if(len([role for role in user_roles if role in instance.write_roles.all()]) > 0):
            permissions = {}
            for role in instance.write_roles.all():
                permissions[role.role] = {}
                permissions[role.role]['write'] = True
                permissions[role.role]['view'] = True
            for role in instance.roles.all():
                if role.role not in permissions:
                    permissions[role.role] = {}
                    permissions[role.role]['write'] = False
                permissions[role.role]['view'] = True

            # for every other role specify no permissions
            for role in Role.objects.all():
                if role.role not in permissions:
                    permissions[role.role] = {}
                    permissions[role.role]['write'] = False
                    permissions[role.role]['view'] = False

            representation['permissions'] = permissions

        return representation
