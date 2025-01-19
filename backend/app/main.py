import os
from fastapi import APIRouter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from langgraph.graph import START, StateGraph,END
from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langchain import hub
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
from langchain_core.prompts import PromptTemplate,ChatPromptTemplate
from langgraph.store.memory import InMemoryStore
from langgraph.store.base import BaseStore
from langchain_core.runnables.config import RunnableConfig
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.memory_store import MongoMemoryStore
from .config import get_settings
from datetime import datetime

from .chat_service import ChatService
from .memory_store import MongoMemoryStore
from .utils import pdf_loader, create_embed,load_vectorstore
from .schemas import UserInput, GraphState
from .config import get_settings

settings=get_settings()
OPENAI_API_KEY=settings.OPENAI_API_KEY
router = APIRouter()

@router.get("/")
async def home():
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_openai import ChatOpenAI

    model = ChatOpenAI(model="gpt-4o-mini")
    
    messages = [
        SystemMessage("Translate the following from English into Italian"),
        HumanMessage("hi!"),
    ]
    model.invoke(messages)

    return {"message": "Hello World"}


@router.get("/create-embeddings")
async def create_embeddings():
    all_docs=pdf_loader('data')
    vectorstore=create_embed(all_docs)
    return {"message": "Embeddings created"}



@router.post("/query-model")
async def query_model(user_input:UserInput):
    query=user_input.query
    user_id=user_input.user_id
    conversation_id=user_input.conversation_id
    # create workflow
    
    chat_service = ChatService()
    
    workflow = StateGraph(GraphState)
    workflow.add_node("call_model", chat_service.call_model)
    workflow.add_node("write_memory", chat_service.write_memory)

    
    workflow.add_edge(START, "call_model")
    workflow.add_edge("call_model", "write_memory")
    
    workflow.add_edge("write_memory", END)
    
    # Create checkpointer for memory
    checkpointer = MemorySaver()
    memory_store=InMemoryStore()
    app = workflow.compile(checkpointer=checkpointer)

    async def stream_response() -> AsyncGenerator[str, None]:
        async for event in app.astream({"messages": [HumanMessage(content=query)]}, config={"configurable": {"thread_id":user_id,"user_id": user_id,"conversation_id":conversation_id}}):
            node = event.get("call_model")
            if node:
                # Ensure we always return a string
                message_content = node["messages"][-1].content
                print(message_content)
                yield message_content
            else:
                continue
    
    return StreamingResponse(stream_response(), media_type="text/event-stream")
