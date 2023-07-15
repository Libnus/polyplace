import jwt

secret_key = "66379ef3a8458867c83b17a1c61f16b0f60d477e098561a0fa51ab0729c2128e"


token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODkzODUzNTEsInVzZXIiOiJ6d2FrYWwiLCJpYXQiOjE2ODkzODE3NTEsImlzX2FkbWluIjp0cnVlLCJzZXNzaW9uX2lkIjoiMSJ9.akuZ1yw1XjwOsJQSBjDBlT34dHc22vv6wASKol1Zvoc"

try:
    payload = jwt.decode(token, secret_key, algorithms=['HS256'])
    print("valid token :)")
except:
    print("signatures don't match!! invalid token!!")

