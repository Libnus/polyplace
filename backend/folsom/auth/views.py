from django.shortcuts import render

from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

from users.models import PolyUser

class AuthViewSet(viewsets.ViewSet):
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

        email = request.META.get('HTTP_mail')
        rcs = request.META.get('HTTP_uid')
        first_name = request.META.get('HTTP_givenName')
        last_name = request.META.get('HTTP_sn')
        rin = request.META.get('HTTP_rin')
        affil = request.META.get('HTTP_eduPersonScopedAffiliation').split('@')[0].lower() # get rid of the extra @rpi.edu at the end

        # check if the user doesn't exists
        if not PolyUser.objects.filter(rcs=rcs).exists():
            # if not create user
            Users.objects.create_user(rcs=rcs, email=email, first_name=first_name ,last_name=last_name, rin=rin)

        # create token
 

# Create your views here.
