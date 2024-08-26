from anthropic import Anthropic
from config import IDENTITY, TOOLS, MODEL, get_quote
from dotenv import load_dotenv

load_dotenv()

class ChatBot:
    """
    Esta classe é responsável por realizar as comunicações com a API da Anthropic,
    que é responsável pela comunicação com o nosso serviço de LLM.
    """
    def __init__(self, session_state):
        self.anthropic = Anthropic()
        self.session_state = session_state

    def generate_message(
        self,
        messages,
        max_tokens,
    ):
        """
        Cria as mensagens que serão enviadas para o modelo de LLM.

        Arguments:
            messages (str): mensagens que serão utilizadas como padrão e prompt.
            max_tokens (num): máximo de tokens que serão utilizados para a mensagem.

        Return:
            response (dict): mensagem de resposta da API para a criação da mensagem.

        Exception:
            e (str): mensagem de erro capturada pela Exception.
        """
        try:
            response = self.anthropic.messages.create(
                model=MODEL,
                system=IDENTITY,
                max_tokens=max_tokens,
                messages=messages,
                tools=TOOLS,
            )
            return response
        except Exception as e:
            return {"error": str(e)}

    def process_user_input(self, user_input):
        """
        Realiza o processamento do input do usuário.

        Arguments:
            user_input (str): input inserido pelo usuário.

        Return:
            response_message (dict): mensagem de resposta tratada e gerada à partir 
            do input do usuário.

        Exception:
            e (str): mensagem de erro capturada pela Exception.
        """
        self.session_state.messages.append({"role": "user", "content": user_input})

        response_message = self.generate_message(
            messages=self.session_state.messages,
            max_tokens=2048,
        )

        if "error" in response_message:
            return f"An error occurred: {response_message['error']}"

        if response_message.content[-1].type == "tool_use":
            tool_use = response_message.content[-1]
            func_name = tool_use.name
            func_params = tool_use.input
            tool_use_id = tool_use.id

            result = self.handle_tool_use(func_name, func_params)
            self.session_state.messages.append(
                {"role": "assistant", "content": response_message.content}
            )
            self.session_state.messages.append({
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": tool_use_id,
                    "content": f"{result}",
                }],
            })

            follow_up_response = self.generate_message(
                messages=self.session_state.messages,
                max_tokens=2048,
            )

            if "error" in follow_up_response:
                return f"An error occurred: {follow_up_response['error']}"

            response_text = follow_up_response.content[0].text
            self.session_state.messages.append(
                {"role": "assistant", "content": response_text}
            )
            return response_text
        
        elif response_message.content[0].type == "text":
            response_text = response_message.content[0].text
            self.session_state.messages.append(
                {"role": "assistant", "content": response_text}
            )
            return response_text
        
        else:
            raise Exception("An error occurred: Unexpected response type")

    def handle_tool_use(self, func_name, func_params):
        """
        Realiza o processamento do input do usuário.

        Arguments:
            func_name (str): input inserido pelo usuário.
            func_params (str): input inserido pelo usuário.

        Return:
            response_message (dict): mensagem de resposta tratada e gerada à partir 
            do input do usuário.

        Exception:
            e (str): mensagem de erro capturada pela Exception.
        """
        if func_name == "get_quote":
            premium = get_quote(**func_params)
            return f"Quote generated: ${premium:.2f} per month"
        
        raise Exception("An unexpected tool was used")
