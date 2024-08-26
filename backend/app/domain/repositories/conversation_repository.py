class ConversationRepository:
    def __init__(self):
        self.conversations = []

    def save(self, conversation):
        """
        Salva a conversa na lista (simulando uma base de dados).
        """
        self.conversations.append(conversation)