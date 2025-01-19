from langgraph.store.base import BaseStore
from typing import Optional
from typing import List, Any
from .config import get_settings
from .dao import MemoryDAO
from .schemas import UserInput, Message, MemoryValue 

class MongoMemoryStore(BaseStore):
    def __init__(self):
        self.dao = MemoryDAO()
    
    def get(self, user_id, conversation_id) -> Optional[object]:
        # Query memory using user_id and conversation_id directly
        result = self.dao.get_conversation(user_id, conversation_id)  # Use user_id and conversation_id as key
        
        if result:
            return result["summary"]

        
        return None

    def put(self, user_id, conversation_id,chat_history: dict):

        # Upsert conversation document into the collection
        self.dao.upsert_conversation(user_id,conversation_id,chat_history)

    def delete(self, namespace, key):
        # Deleting the memory document based on namespace and key
        namespace_str = self._get_namespace_key(namespace, key)
        self.dao.delete_memory(namespace_str, key)

    def batch(self, keys: List[str]) -> List[Optional[object]]:
        # Retrieve multiple keys in a batch
        return [self.get(key) for key in keys]

    def abatch(self, keys: List[str]) -> List[Optional[object]]:
        # Async batch retrieval (if needed)
        import asyncio
        return asyncio.run(self._async_get_all(keys))
    
    async def _async_get_all(self, keys: List[str]) -> List[Optional[object]]:
        # Async implementation of batch retrieval
        return [self.get(key) for key in keys]
