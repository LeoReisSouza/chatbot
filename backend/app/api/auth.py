from fastapi import APIRouter
from app.api.controllers import register_user_controller, login_user_controller
from app.domain.models.auth import UserCreate, UserLogin, Token

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserCreate):
    return register_user_controller(user)

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    return login_user_controller(user)