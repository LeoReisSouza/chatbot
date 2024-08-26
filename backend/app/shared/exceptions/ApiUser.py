class APIError(Exception):
    """
    Exceção genérica para erros na API.
    """
    def __init__(self, message: str = "Erro interno da API"):
        self.message = message
        super().__init__(self.message)