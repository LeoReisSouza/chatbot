import re

class SQLSanitizer:
    """
    Classe para sanitizar entradas do usuário, removendo possíveis tentativas de SQL Injection.
    """

    def sanitize(self, input_text: str) -> str:
        """
        Sanitiza a entrada removendo padrões maliciosos comuns de SQL injection.

        Args:
            input_text (str): Texto a ser sanitizado.

        Returns:
            str: Texto sanitizado.
        """
        # Define um padrão regex para detectar tentativas comuns de SQL injection
        patterns = [
            r"(\bor\b|\band\b)\s+\d+\s*=\s*\d+",  # Operadores OR e AND com comparações
            r"(--)|(;)|(')|(\bunion\b)|(\bdrop\b)|(\bselect\b)|(\binsert\b)|(\bdelete\b)|(\bupdate\b)",
            r"(\bexec\b)|(\bexecute\b)|(\bshutdown\b)|(\bgrant\b)|(\brevoke\b)|(\binto\b)",
        ]
        
        # Substitui todos os padrões correspondentes por uma string vazia para "neutralizar" o SQL injection
        for pattern in patterns:
            input_text = re.sub(pattern, "", input_text, flags=re.IGNORECASE)
        
        # Retorna o texto sanitizado
        return input_text