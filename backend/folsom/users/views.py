from django.shortcuts import render
from django.core.exceptions import PermissionDenied

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import PolyUserSerializer

from shibboleth.utils import check_token

from users.models import PolyUser

class PolyUserViewSet(viewsets.ViewSet):
    # retrieve for a user retrieves information about the user
    # NOTE: this only returns the user associated with a session token. You cannot use this call to get all users
    # it will return name, email, rin, and the user's roles
    @action(detail=False, methods=['get'])
    def user(self, request):
        token = check_token(request)
        if token == False:
            raise PermissionDenied()
        print(token)
        token = token[1]

        # check user from their token
        user = PolyUser.objects.get(rcs=token['user'])
        return Response(PolyUserSerializer(user, many=False).data)
