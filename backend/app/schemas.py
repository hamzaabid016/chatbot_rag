from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage
from fastapi import APIRouter, UploadFile, File, Form, Depends


class Message(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MemoryValue(BaseModel):
    user_id: str
    conversation_id: str
    chat_history: dict
    
class GraphState(TypedDict):
    question: str
    context: List[Document]
    answer: str
    messages: List[BaseMessage]
    user_id:str
    conversation_id:str
    file_content:str