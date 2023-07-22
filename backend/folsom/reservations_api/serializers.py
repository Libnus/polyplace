from rest_framework.serializers import ModelSerializer
from reservations.models import Reservation
from users.models import PolyUser

from shibboleth.utils import check_token

class ReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request')
        token = check_token(request)[1] # at this point we can be certain token is valid
        user = PolyUser.objects.get(pk=instance.user.id)


        if user.rcs == token['user']:
            representation['first_name'] = instance.user.first_name
            representation['last_name'] = instance.user.last_name

        elif instance.hidden and user.rcs != token['user']:
            representation['first_name'] = "Hidden"
            representation['last_name'] = "Reservation"
            representation['event_name'] = "Reservation"

        if user.rcs == token['user']:
            representation['user_event'] = True
        else: representation['user_event'] = False


        return representation
