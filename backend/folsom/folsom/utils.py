import jwt
from datetime import datetime, timedelta

from decouple import config

secret_key = config("TOKEN_SECRET_KEY")

# used to generate a generic jwt token for a dev user
def generate_token():
    token = {}
    token['iat'] = datetime.utcnow()
    token['exp'] = datetime.utcnow() + timedelta(hours=10)
    token['user'] = 'devel'
    token['is_admin'] = True
    token['session_id'] = '1'

    token = jwt.encode(token, secret_key, algorithm="HS256")

    print(token)
    return token

generate_token()
