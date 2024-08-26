from pydantic import BaseModel
from app.domain.models.user import User

class Conversation(BaseModel):
    user: User
    user_message: str
    bot_response: str