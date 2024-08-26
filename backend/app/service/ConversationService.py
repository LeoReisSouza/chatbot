from app.domain.models.conversation import Conversation
from app.infrastructure.external_services.anthropic_client import AnthropicClient
from app.domain.repositories.conversation_repository import ConversationRepository

class ConversationService:
    def __init__(self):
        self.repository = ConversationRepository()
        self.ai_client = AnthropicClient()

    def process_message(self, user_message: str, user) -> Conversation:
        """
        Processa a mensagem do usuário, consulta o LLM da Anthropic e retorna a conversa.
        """
        # Consultar LLM da Anthropic
        bot_response = self.ai_client.get_response(user_message)

        # Criar uma nova instância de Conversa
        conversation = Conversation(user=user, user_message=user_message, bot_response=bot_response)

        # Salvar a conversa no repositório
        self.repository.save(conversation)

        return conversation