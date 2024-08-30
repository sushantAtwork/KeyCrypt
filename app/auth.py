import os
from datetime import datetime, timedelta
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBasicCredentials

from app.schemas import TokenData

load_dotenv()

SECRET_KEY = str(os.getenv('jwt_secret_key'))
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRES_MINUTE = 120

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def generate_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTE)
    to_encode.update({'exp': expire})
    jwt_token = jwt.encode(payload=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(jwt=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get('sub')
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not authorized',
                                headers={'WWW-Authenticate': 'Bearer'})
        token_data = TokenData(email=email)
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not authorized',
                            headers={'WWW-Authenticate': 'Bearer'})
    return token_data


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        else:
            token_data = TokenData(username=username, token=token)
    except JWTError:
        raise HTTPBasicCredentials
    return token_data
