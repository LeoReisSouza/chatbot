import os
from fastapi import Request, HTTPException, Depends
from jose import JWTError, jwt

from backend.app.domain.models.TokenAuth import TokenData

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = 'HS256'

def verify_token(request: Request, token: str = Depends()) -> TokenData:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data