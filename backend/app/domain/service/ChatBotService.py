import json
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
        self.schema_cache = {}

    def connect_to_db(self, dbname_used):
        """
        Estabelece conexão com o banco de dados PostgreSQL.
        """
        try:
            connection = psycopg2.connect(
                dbname=dbname_used,
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT")
            )
            logger.info("Conexão com o banco de dados PostgreSQL estabelecida com sucesso.")
            logger.info(dbname_used)
            return connection
        except Exception as e:
            logger.error(f"Falha ao conectar ao banco de dados PostgreSQL: {e}")
            return None

    def get_table_columns(self, user_input):
        """
        Recupera dinamicamente os nomes das tabelas e colunas do banco de dados.
        """
        if self.schema_cache:
            return self.schema_cache
        user_database_selected = user_input.split(",")[0]
        user_schema_selected = user_input.split(",")[1].strip()
        query = f"""
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = '{user_schema_selected}'
        """

        connection = self.connect_to_db(user_database_selected)
        if not connection:
            return None

        try:
            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()

                schema_info = {}
                for table, column in rows:
                    if table not in schema_info:
                        schema_info[table] = []
                    schema_info[table].append(column)
                
                self.schema_cache = schema_info
                return schema_info
        except Exception as e:
            logger.error(f"Falha ao recuperar informações do esquema: {e}")
            return None
        finally:
            connection.close()

    def generate_message(self, messages, max_tokens, user_input):
        """
        Cria as mensagens que serão enviadas para o modelo LLM, incluindo informações sobre tabelas e colunas.
        """
        table_columns = self.get_table_columns(user_input)
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
            user_input=user_input
        )

        if "error" in response_message:
            return f"Ocorreu um erro: {response_message['error']}"

        response_text = response_message.content[0].text.strip()

        select_index = response_text.lower().find("select")

        if select_index == -1:
            logger.error("Nenhuma instrução SELECT foi encontrada na resposta.")
            return "Nenhuma instrução SELECT foi encontrada na resposta."

        sql_query = response_text[select_index:].strip()
        try:
            print(sql_query)
            result = self.execute_sql_query(sql_query, user_input)
            return result
        except Exception as e:
            logger.error(f"Falha ao executar a query: {e}")
            return f"Falha ao executar a query: {e}"


    def execute_sql_query(self, query, user_input):
        """
        Executa a query SQL gerada pelo chatbot e retorna o resultado como JSON.
        """
        user_database_selected = user_input.split(",")[0]
        user_schema_selected = user_input.split(",")[1]

        connection = self.connect_to_db(user_database_selected)
        if not connection:
            return json.dumps({"error": "Falha ao conectar ao banco de dados."})

        try:
            with connection.cursor() as cursor:
                if user_schema_selected:
                    cursor.execute(f"SET search_path TO {user_schema_selected};")
                
                logger.info(f"Executando a query: {query}")
                cursor.execute(query)

                columns = [desc[0] for desc in cursor.description]
                result = cursor.fetchall()

                json_result = [dict(zip(columns, row)) for row in result]
                return json_result
        except Exception as e:
            logger.error(f"Ocorreu um erro durante a execução da SQL: {e}")
            return json.dumps({"error": str(e)})
        finally:
            connection.close()
