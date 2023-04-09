from rest_framework.serializers import ModelSerializer
from .models import Room, Reservation, Floor

class FloorSerializer(ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

class ReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
