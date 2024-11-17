from decimal import Decimal
import os
from fastapi import APIRouter, Body, HTTPException, Depends
from app.domain.service.ChatBotService import ChatBot
from app.domain.models.database_request import SchemaRequest, TableRequest
from app.domain.service.DatabaseService import Database
from psycopg2 import OperationalError

# Inicialize o router
router = APIRouter()

# Carrega variáveis de ambiente para conexão com o banco de dados
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")

@router.post("/chat")
def chat_with_bot_endpoint(user_message: str = Body(..., embed=True)):
    """
    Endpoint para enviar uma mensagem ao chatbot e obter a resposta.
    
    Args:
        user_message (str): Mensagem do usuário para o chatbot.

    Returns:
        dict: Resposta do chatbot.
    """
    session_state = {"content": []}

    try:
        chatbot = ChatBot(session_state=session_state)
        #retorno = chatbot.process_user_input(user_message)
        #print(retorno)
        #return retorno
        return [{'avg_active_processes': 361.2119289340101523},{'avg_act': 361.2119289340101523},]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar a mensagem do chatbot: {e}")

def get_database_client():
    """
    Cria uma instância do cliente de banco de dados.

    Returns:
        Database: Instância configurada do cliente de banco de dados.
    
    Raises:
        HTTPException: Caso ocorra falha na conexão.
    """
    try:
        return Database(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            name=os.getenv("DB_NAME")
        )
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Erro ao conectar com o banco de dados.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado ao conectar ao banco de dados: {e}")


@router.get("/databases")
def get_databases_endpoint(database_client: Database = Depends(get_database_client)):
    """
    Endpoint para obter a lista de databases no servidor PostgreSQL.

    Returns:
        list: Lista de nomes das databases.
    """
    try:
        return database_client.get_databases()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter databases: {e}")

@router.post("/schemas")
def get_schemas_endpoint(request: SchemaRequest, database_client: Database = Depends(get_database_client)):
    """
    Endpoint para obter a lista de schemas em uma database especificada.

    Args:
        request (SchemaRequest): Requisição contendo o nome da database.

    Returns:
        list: Lista de nomes dos schemas.
    """
    try:
        return database_client.get_schemas(request.dbname)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter schemas: {e}")

@router.post("/tables")
def get_tables_endpoint(request: TableRequest, database_client: Database = Depends(get_database_client)):
    """
    Endpoint para obter a lista de tabelas em um schema específico dentro de uma database especificada.

    Args:
        request (TableRequest): Requisição contendo o nome da database e do schema.

    Returns:
        list: Lista de nomes das tabelas.
    """
    try:
        return database_client.get_tables(request.dbname, request.schema_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter tabelas: {e}")
