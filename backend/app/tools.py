from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from .memory_store import MongoMemoryStore
from .config import get_settings
from datetime import datetime
from .utils import generate_summary

class Tools:
    def __init__(self):
        settings = get_settings()
        self.llm = ChatOpenAI(model=settings.MODEL_NAME)
        self.memory_store = MongoMemoryStore()
    
    def call_model(self, state, config):
        user_id = config["metadata"]['user_id']
        conversation_id = config["metadata"]['conversation_id']
        query = state['messages'][-1].content
        
        existing_summary = self.memory_store.get(user_id,conversation_id)
    
        
        prompt_template = ChatPromptTemplate.from_template(
            """You are an assistant for question-answering tasks. Use the following pieces of retrieved context and prior memory to answer the question.
            Previous Conversation History:
            {memory}
            Question: {question}
            Answer:"""
        )
        
        prompt = prompt_template.invoke({
            "memory": existing_summary,
            "question": query
        })
        response = self.llm.invoke(prompt)
        return {"messages": state['messages'] + [response]}
    
    def write_memory(self, state, config):
        user_id = config["metadata"]['user_id']
        conversation_id = config["metadata"]['conversation_id']
        
        summary=self.memory_store.get(user_id, conversation_id)
        summary_content  = summary if  summary else 'No summary'
        
        new_messages = [
            {
                "role": "user" if isinstance(msg, HumanMessage) else "assistant",
                "content": msg.content,
                "timestamp": datetime.utcnow()
            }
            for msg in state['messages']
        ]
        new_summary=generate_summary(summary_content,new_messages)
        chat_history = {
            "summary": new_summary,
            "messages": new_messages,
            "last_updated": datetime.utcnow()
        }
        
        self.memory_store.put(user_id, conversation_id, chat_history)
        return state