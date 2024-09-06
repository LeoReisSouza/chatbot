from fastapi import APIRouter, Depends
from app.api.controllers import send_message
from app.domain.models.conversation import Conversation
from app.domain.models.user import User

router = APIRouter()

router.include_router(auth_router, prefix="/auth")

@router.post("/chat", response_model=Conversation)
def chat_with_bot_endpoint(user_message: str, user: User = Depends()):
    """
    Endpoint para enviar uma mensagem ao chatbot e obter a resposta.
    """
    return chat_with_bot_controller(user_message, user)