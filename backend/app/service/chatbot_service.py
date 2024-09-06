from app.domain.models.conversation import Conversation
from app.domain.models.user import User

def send_message(user_message: str, user: User) -> Conversation:
    # Lógica para processar a mensagem do usuário e gerar a resposta do chatbot
    return Conversation(message=user_message, response="Hello, this is a response")