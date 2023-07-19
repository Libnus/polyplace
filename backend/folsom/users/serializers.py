from users.models import PolyUser
from rest_framework import serializers

class PolyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolyUser
        fields = ['rcs', 'first_name', 'last_name', 'is_admin', 'is_rpi_staff']
