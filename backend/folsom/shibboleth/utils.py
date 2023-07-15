import jwt
from decouple import config
from django.conf import settings

secret_key = config('TOKEN_SECRET_KEY')

# check if a user is authenticated
def  check_token(request):
    if settings.ENV == 'devel':
        # NOTE: generic token is a token only valid in development
        generic_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk0NDQyNDksImV4cCI6MTY4OTQ4MDI0OSwidXNlciI6ImRldmVsIiwiaXNfYWRtaW4iOnRydWUsInNlc3Npb25faWQiOiIxIn0._uO5z7h5TN23xF44zjtvu3OcK3XNcSTxO9ke_32YoCQ"
        token = jwt.decode(generic_token, secret_key, algorithms=["HS256"])
        return (True,token)

    if 'polyplace_token' not in request.session: return False
    token = request.session['polyplace_token']

    try:
        token = jwt.decode(token, secret_key, algorithms=["HS256"])
        return (True,token)
    except:
        return False
