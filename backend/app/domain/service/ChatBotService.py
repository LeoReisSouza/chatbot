import os
from anthropic import Anthropic
from anthropic import AnthropicBedrock
from dotenv import load_dotenv
import logging
from app.domain.service.config import IDENTITY, EXAMPLES, ADDITIONAL_GUARDRAILS
import psycopg2

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ChatBot:
    """
    Esta classe é responsável por realizar as comunicações com a API da Anthropic,
    e se conectar ao banco de dados PostgreSQL.
    """
    def __init__(self, session_state):
        self.client = AnthropicBedrock(
            aws_access_key=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            aws_region=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.anthropic = Anthropic(api_key=os.getenv("HAIKU_API_KEY"))
        self.session_state = session_state
        self.db_connection = self.connect_to_db()
        self.schema_cache = {}

    def connect_to_db(self):
        """
        Estabelece conexão com o banco de dados PostgreSQL.
        """
        try:
            connection = psycopg2.connect(
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT")
            )
            logger.info("Conexão com o banco de dados PostgreSQL estabelecida com sucesso.")
            return connection
        except Exception as e:
            logger.error(f"Falha ao conectar ao banco de dados PostgreSQL: {e}")
            return None

    def get_table_columns(self):
        """
        Recupera dinamicamente os nomes das tabelas e colunas do banco de dados.
        """
        if self.schema_cache:
            return self.schema_cache

        query = """
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        """
        try:
            with self.db_connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
                schema_info = {}
                for table, column in rows:
                    if table not in schema_info:
                        schema_info[table] = []
                    schema_info[table].append(column)
                self.schema_cache = schema_info
                print(schema_info)
                logger.info("Informações do esquema recuperadas com sucesso.")
                return schema_info
        except Exception as e:
            logger.error(f"Falha ao recuperar informações do esquema: {e}")
            return None

    def generate_message(self, messages, max_tokens):
        """
        Cria as mensagens que serão enviadas para o modelo LLM, incluindo informações sobre tabelas e colunas.
        """
        table_columns = self.get_table_columns()
        if not table_columns:
            return {"error": "Falha ao recuperar o esquema do banco de dados."}

        dynamic_context = "Available tables and columns:\n"
        for table, columns in table_columns.items():
            dynamic_context += f"Table: {table}, Columns: {', '.join(columns)}\n"
            print(dynamic_context)

        try:
            response = self.anthropic.beta.prompt_caching.messages.create(
                model="claude-3-haiku-20240307",
                system=[
                    {
                        "type": "text", 
                        "text": IDENTITY,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text", 
                        "text": EXAMPLES,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text", 
                        "text": ADDITIONAL_GUARDRAILS,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text", 
                        "text": dynamic_context,
                        "cache_control": {"type": "ephemeral"}
                    },
                ],
                max_tokens=max_tokens,
                messages=messages
            )
            return response
        except Exception as e:
            logger.error(f"Erro ao gerar mensagem para o modelo: {e}")
            return {"error": str(e)}

    def process_user_input(self, user_input):
        """
        Processa a entrada do usuário e gera uma query SQL.
        """
        if "messages" not in self.session_state:
            self.session_state["messages"] = []

        self.session_state["messages"].append({"role": "user", "content": user_input})

        response_message = self.generate_message(
            messages=self.session_state["messages"],
            max_tokens=1024,
        )

        if "error" in response_message:
            return f"Ocorreu um erro: {response_message['error']}"

        if response_message.content[-1].type == "text":
            sql_query = response_message.content[0].text.strip()
            try:
                result = self.execute_sql_query(sql_query)
                return result
            except Exception as e:
                logger.error(f"Falha ao executar a query: {e}")
                return f"Falha ao executar a query: {e}"
        else:
            logger.error("Ocorreu um erro: Tipo de resposta inesperado.")
            raise Exception("Ocorreu um erro: Tipo de resposta inesperado")

    def execute_sql_query(self, query):
        """
        Executa a query SQL gerada pelo chatbot.
        """
        try:
            with self.db_connection.cursor() as cursor:
                print(query)
                cursor.execute(query)
                result = cursor.fetchall()
                return result
        except Exception as e:
            logger.error(f"Ocorreu um erro durante a execução da SQL: {e}")
            return f"Ocorreu um erro durante a execução da SQL: {e}"