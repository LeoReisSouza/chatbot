# config.py
import os

class Config:
    MONGO_URI = os.getenv("MONGO_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
