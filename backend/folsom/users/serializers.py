from users.models import PolyUser, Role
from rest_framework import serializers

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

class PolyUserSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True)

    class Meta:
        model = PolyUser
        fields = ['rcs', 'first_name', 'last_name', 'is_admin', 'roles']
