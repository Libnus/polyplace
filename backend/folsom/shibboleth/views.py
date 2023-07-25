from django.shortcuts import render, redirect

from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

from users.models import PolyUser

import jwt
import uuid
from datetime import datetime, timedelta
from decouple import config

class ShibbolethAuthViewSet(viewsets.ViewSet):
    # "create" a new user authentication
    def create(self, request):

        '''
        When authenticating a user, the backend expects these attributes from the RPI Shibboleth IdP:

         attribute       description      example
      +-------------+-----------------------------------+
      |  email        | the user email | zwakal@rpi.edu |
      |  rcs          | rcs id         | zwakal         |
      |  firstName    | first name     | Linus          |
      |  lastName     | lsat name      | Zwaka          |
      |  rin          | rin            | 000000001      |
      |  affiliations | user groups    | Staff@rpi.edu  |
      +---------------+----------------+----------------+

        eduPersonScopedAffiliation?

        '''

        email = request.META.get('HTTP_MAIL')
        rcs = request.META.get('HTTP_UID')
        first_name = request.META.get('HTTP_GIVENNAME')
        last_name = request.META.get('HTTP_SN')
        rin = request.META.get('HTTP_RIN')
        affil = request.META.get('HTTP_EDUPERSONSCOPEDAFFILIATION').split('@')[0].lower() # get rid of the extra @rpi.edu at the end

        user = None
        # check if the user doesn't exists
        if not PolyUser.objects.filter(rcs=rcs).exists():
            # if not create user
            user = PolyUser.objects.create_user(rcs=rcs, email=email, first_name=first_name, last_name=last_name, rin=rin)
        else:
            print("user found!")
            user = PolyUser.objects.get(rcs=rcs)

        # create token
        # not so secret right now ;)
        secret_key = config('TOKEN_SECRET_KEY')

        token = {}

        token['iat'] = datetime.utcnow()
        token['exp'] = 1752867891422
        token['user'] = rcs
        token['is_admin'] = user.is_admin
        token['session_id'] = str(uuid.uuid4())

        token = jwt.encode(token, secret_key, algorithm="HS256")

        # save the token
        request.session['polyplace_token'] = token

        # redirect user to home
        return redirect('http://18.212.225.169/')

    # log a user out of shibboleth
    @action(detail=False)
    def logout(self, request, pk=None):
        # delete the token
        del request.session['token']

        # log the user out
        return redirect("https://example.com/Logout")
