from fastapi import APIRouter, Depends
from app.api.controllers import send_message
from app.domain.models.conversation import Conversation
from app.domain.models.user import User

router = APIRouter()

@router.post("/chat", response_model=Conversation)
def chat_with_bot(user_message: str, user: User = Depends()):
    """
    Endpoint para enviar uma mensagem ao chatbot e obter a resposta.
    """
    conversation = send_message(user_message, user)
    return conversation