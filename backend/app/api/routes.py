from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.controllers import chat_with_bot_controller, send_message
from backend.app.api import auth
from backend.app.api.middleware import verify_token
from backend.app.domain.models.Conversation import Conversation
from backend.app.domain.models.TokenAuth import TokenData
from backend.app.domain.models.UserLogin import UserLogin
from backend.app.domain.repositories.Mongodb import MongoDBRepository

router = APIRouter()

router.include_router(auth, prefix="/auth")

@router.post("/chat", response_model=Conversation)
def chat_with_bot_endpoint(user_message: str, user: UserLogin = Depends(), token_data: TokenData = Depends(verify_token)):
    """
    Endpoint para enviar uma mensagem ao chatbot e obter a resposta.
    """
    return chat_with_bot_controller(user_message, user)


@router.get("/data_dictionaries", response_model=List[Dict])
def get_data_dictionaries(
    button_value: str = Query(..., description="Valor enviado pelo botão do frontend"), 
    repository: MongoDBRepository = Depends(),
    token_data: TokenData = Depends(verify_token)
):
    """
    Endpoint para obter os dados dos dicionários de dados com base no valor do botão.
    """
    try:
        data_dictionaries = repository.get_collection(button_value)
        
        if not data_dictionaries:
            raise HTTPException(status_code=404, detail="No data dictionaries found for this button value.")
        
        return data_dictionaries

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))