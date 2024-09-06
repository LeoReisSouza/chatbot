from app.services.auth_service import authenticate_user, register_user
from app.services.chatbot_service import send_message
from app.domain.models.auth import UserCreate, UserLogin, Token
from app.domain.models.conversation import Conversation
from app.domain.models.user import User

def register_user_controller(user: UserCreate) -> Token:
    return register_user(user)

def login_user_controller(user: UserLogin) -> Token:
    return authenticate_user(user)

def chat_with_bot_controller(user_message: str, user: User) -> Conversation:
    return send_message(user_message, user)