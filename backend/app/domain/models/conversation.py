from pydantic import BaseModel
from .UserCreate import UserCreate

class Conversation(BaseModel):
    user: UserCreate
    user_message: str
    bot_response: str