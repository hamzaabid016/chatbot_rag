# app/config/settings.py
from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os


load_dotenv()

class Settings(BaseSettings):
    MONGODB_URL: str = os.environ.get('MONGODB_URL', "mongodb://localhost:27017")
    DB_NAME: str = os.environ.get('DB_NAME', "chat_memory")
    COLLECTION_NAME: str = os.environ.get('COLLECTION_NAME', "memories")
    OPENAI_API_KEY: str = os.environ.get('OPENAI_API_KEY')
    MODEL_NAME: str = os.environ.get('MODEL_NAME', "gpt-4o-mini")
    MONGO_INITDB_ROOT_USERNAME: str = os.environ.get("MONGO_INITDB_ROOT_USERNAME")
    MONGO_INITDB_ROOT_PASSWORD : str =os.environ.get("MONGO_INITDB_ROOT_PASSWORD")
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()