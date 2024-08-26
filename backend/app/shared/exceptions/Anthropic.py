class AnthropicServiceError(Exception):
    """
    Exceção lançada quando ocorre um erro na comunicação com o serviço da Anthropic.
    """
    def __init__(self, message: str = "Erro ao se comunicar com o serviço da Anthropic"):
        self.message = message
        super().__init__(self.message)