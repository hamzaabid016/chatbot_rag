# app/dao/memory_dao.py

from pymongo import MongoClient, ASCENDING
from datetime import datetime
from typing import Optional, List
from .config import get_settings
from .schemas import MemoryValue, Message, UserInput, GraphState

class MemoryDAO:
    def __init__(self):
        settings = get_settings()
        self.client = MongoClient(
            settings.MONGODB_URL,
            username=settings.MONGO_INITDB_ROOT_USERNAME,
            password=settings.MONGO_INITDB_ROOT_PASSWORD,
            authSource="admin"
        )
        self.db = self.client[settings.DB_NAME]
        self.collection = self.db[settings.COLLECTION_NAME]
        
        # Create index on conversation_id for efficient querying
        self.collection.create_index([("conversation_id", ASCENDING), ("user_id", ASCENDING)], unique=True)

    def get_conversation(self, user_id: str, conversation_id: str) -> Optional[dict]:
        result = self.collection.find_one({"conversation_id": conversation_id, "user_id": user_id})
        if result:
            return result
        return None

    def upsert_conversation(self, user_id:str, conversation_id: str, chat_history: dict) -> None:
        # Upsert conversation document
        self.collection.update_one(
            {"conversation_id": conversation_id, "user_id": user_id},
            {"$set": chat_history},
            upsert=True
        )

    def delete_conversation(self, conversation_id: str, user_id: str):
        self.collection.delete_one({"conversation_id": conversation_id, "user_id": user_id})

    def batch_get_conversations(self, conversation_ids: List[str]) -> List[Optional[dict]]:
        return [self.get_conversation(conversation_id, user_id) for conversation_id, user_id in conversation_ids]

    def batch_upsert_conversations(self, user_inputs: List[UserInput], messages_list: List[List[Message]], summaries: List[str]):
        for user_input, messages, summary in zip(user_inputs, messages_list, summaries):
            self.upsert_conversation(user_input, messages, summary)
