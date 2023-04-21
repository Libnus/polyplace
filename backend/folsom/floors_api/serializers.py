from rest_framework import serializers
from floors.models import Building, Floor, Room
from datetime import datetime, timedelta
from reservations.models import Reservation

class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

# from a list of events and an ending event, find the next time where a room is available
# a room is not bookable if there is an event within 30 minutes of the current time
def find_next_available_time(last_event, events):
    if len(events) == 0: return last_event

    # while last event is within 30 minutes of the next event
    current_min = min(events,key=lambda time:time[0])
    while last_event < current_min[0]+timedelta(minutes=30):
        last_event = current_min[1]
        events.remove(current_min)

        if len(events) == 0: return last_event
        current_min = min(events,key=lambda time:time[0])

    return last_event

class RoomSerializer(serializers.ModelSerializer):
    room_status = serializers.SerializerMethodField('get_room_status')

    # returns the current status of a room in a json where the first element is the status and second is the time this status ends:
    # examples:
    # {status: 'free', time: '10:30 A.M.'}        -- room is free until 10:30
    # {status: 'reserved', time: '3:30 P.M.'}     -- room is reserved until 3:30
    # {status: 'not_bookable', time: '1:00 P.M.'} -- room is free but not bookable as there is an upcoming event within 30 minutes.
    # {status: 'closed', time: ''}                -- room is closed with no time specified
    def get_room_status(self, room):
        state = {'status': "", 'time': "", 'event': ""}

        # loop over the reservations and find the event closest to the current time
        current_time = datetime.now()
        events = []
        for reservation in Room.objects.get(id=room.id).reservations.all():
            reservation_object = Reservation.objects.get(id=reservation.id)

            if reservation_object.end_time > current_time: # if the event has not passed
                events.append((reservation_object.start_time,reservation_object.end_time,reservation_object.event_name))

        if len(events) == 0:
            state['status'] = "free"
            state['time'] = ""
            state['event'] = ""
            return state


        min_event = min(events, key=lambda time:time[0])
        events.remove(min_event)
        time_format = "%I:%M %p"

        # find the status of the event

        if min_event[0] < datetime.now():
            state['status'] = "reserved" # min_event[1].strftime(time_format)
            state['time'] = find_next_available_time(min_event[1], events).strftime(time_format)
            state['event'] = min_event[2]

        elif min_event[0] < datetime.now()+timedelta(minutes=30):
            state['status'] = "not_bookable"
            state['time'] = find_next_available_time(min_event[1],events).strftime(time_format)
            state['event'] = min_event[2]

        else:
            state['status'] = "free"
            state['time'] = min_event[0].strftime(time_format)
            state['event'] = min_event[2]

        return state


    class Meta:
        model = Room
        fields = '__all__'
