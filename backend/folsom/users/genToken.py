import jwt

from datetime import datetime, timedelta
from decouple import config

token = {}

key = config('TOKEN_SECRET_KEY')

token['iat'] = datetime.utcnow()
token['exp'] = 1752867891422
token['user'] = "devel"
token['is_admin'] = True
token['session_id'] = "1"

token = jwt.encode(token, key, algorithm="HS256")

print(token)
