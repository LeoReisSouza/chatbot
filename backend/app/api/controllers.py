from app.service.ConversationService import ConversationService
from app.domain.models.conversation import Conversation
from app.domain.models.user import User

def send_message(user_message: str, user: User) -> Conversation:
    """
    Processa a mensagem do usuário e retorna a conversa completa.
    """
    conversation_service = ConversationService()
    response = conversation_service.process_message(user_message, user)
    return response