from rest_framework.serializers import ModelSerializer
from reservations.models import Reservation

class ReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"
