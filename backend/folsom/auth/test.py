import jwt
from datetime import datetime, timedelta

import secrets

secret_key = "66379ef3a8458867c83b17a1c61f16b0f60d477e098561a0fa51ab0729c2128e"

payload = {}

expires = datetime.utcnow() + timedelta(hours=1)
payload['exp'] = datetime.utcnow() + timedelta(hours=1)
payload['user'] = "zwakal"
payload['iat'] = datetime.utcnow()
payload['is_admin'] = False
payload['session_id'] = "1"

token = jwt.encode(payload, secret_key, algorithm="HS256")

print(token)
