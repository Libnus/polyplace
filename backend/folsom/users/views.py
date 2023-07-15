from django.shortcuts import render
from django.core.exceptions import PermissionDenied

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import PolyUserSerializer

from shibboleth.utils import check_token, decode

from users.models import PolyUser

class PolyUserViewSet(viewsets.ViewSet):
    # retrieve for a user retrieves information about the user
    # NOTE: this only returns the user associated with a session token. You cannot use this call to get all users
    # it will return name, email, rin, and the user's roles
    @action(detail=False, methods=['get'])
    def user(self, request):
        if 'polyplace_token' not in request.session or not check_token(request.session['polyplace_token']):
            raise PermissionDenied()

        # check user from their token
        user_token = decode(request.session['polyplace_token'])
        user = PolyUser.objects.get(rcs=user_token['user'])
        print(user)

        return Response(PolyUserSerializer(user, many=False).data)
