import os
from config import Config
from fastapi import APIRouter, HTTPException, Depends
from backend.app.domain.models.UserCreate import UserCreate
from backend.app.domain.models.UserLogin import UserLogin
from backend.app.domain.repositories.Mongodb import MongoDBRepository
from backend.app.domain.repositories.User import UserService
from backend.app.infrastructure.RepositoryInterface import RepositoryInterface
from backend.app.service.PasswordService import PasswordService
import jwt
import datetime

SECRET_KEY = os.getenv("JWT_SECRET")

router = APIRouter()

def get_repository() -> RepositoryInterface:
    return MongoDBRepository(uri=Config.MONGO_URI, database_name=Config.DATABASE_NAME)

@router.post("/register")
async def register(user: UserCreate, repo: RepositoryInterface = Depends(get_repository)):
    """
    Endpoint para fazer o registro do usuário.
    """
    try:
        hashed_password = PasswordService.hash_password(user.senha)
        user_data = user.dict()
        user_data['senha'] = hashed_password
        user_service = UserService(repo)
        user_service.create_user(user_data)
        return {"msg": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(user: UserLogin, repo: RepositoryInterface = Depends(get_repository)):
    """
    Endpoint para fazer o login do usuário.
    """
    try:
        if not user.email or not user.senha:
            raise HTTPException(status_code=400, detail="Email and password are required.")

        user_service = UserService(repo)
        user_data = user_service.get_user(user.email)
        if not user_data:
            raise HTTPException(status_code=400, detail="User does not exist.")

        if not PasswordService.check_password(user_data['senha'], user.senha):
            raise HTTPException(status_code=400, detail="Invalid Credentials.")

        token = jwt.encode(
            {'id': str(user_data['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY,
            algorithm='HS256'
        )

        del user_data['senha']  # Remove password from response
        return {"token": token, "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))