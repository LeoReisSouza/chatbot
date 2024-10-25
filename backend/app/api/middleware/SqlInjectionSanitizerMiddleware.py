from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

from backend.app.shared.utils.sanitizer_sql_injection import SQLSanitizer

class SQLInjectionSanitizerMiddleware(BaseHTTPMiddleware):
    """
    Middleware para sanitizar a entrada do usuário contra SQL injection.
    """

    def __init__(self, app, sanitizer: SQLSanitizer):
        super().__init__(app)
        self.sanitizer = sanitizer

    async def dispatch(self, request: Request, call_next):
        # Verifique se o endpoint usa o parâmetro `user_message`
        if request.method == "POST" and "/api/chat" in str(request.url):
            body = await request.json()
            user_message = body.get("user_message")
            
            if user_message:
                # Sanitiza a mensagem do usuário
                sanitized_message = self.sanitizer.sanitize(user_message)
                
                # Se a mensagem foi alterada, lançamos uma exceção para evitar possível ataque
                if sanitized_message != user_message:
                    raise HTTPException(
                        status_code=400,
                        detail="Entrada inválida detectada. Por favor, verifique sua mensagem."
                    )
        
        # Continua para a próxima etapa se estiver tudo bem
        response = await call_next(request)
        return response