import jwt
from decouple import config

secret_key = config('TOKEN_SECRET_KEY')

# check if a user is authenticated
def  check_token(token):
        try:
            token = jwt.decode(token, secret_key, algorithms=["HS256"])
            return True
        except:
            return False

def decode(token):
    return jwt.decode(token, secret_key, algorithms=["HS256"])
