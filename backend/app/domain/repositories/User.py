from typing import Type
from backend.app.infrastructure.RepositoryInterface import RepositoryInterface

class UserService:
    def __init__(self, repo: RepositoryInterface):
        self.repo = repo

    def create_user(self, user_data: dict) -> None:
        self.repo.insert_document('users', user_data)

    def get_user(self, email: str) -> dict:
        return self.repo.get_document('users', {'email': email})
