from rest_framework.serializers import ModelSerializer
from floors.models import Floor, Room

class FloorSerializer(ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
