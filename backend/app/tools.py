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
        user_id = state["user_id"]
        conversation_id=state['conversation_id']
        file_content=state["file_content"]
        query = state['messages'][-1].content
        
        existing_summary = self.memory_store.get(user_id,conversation_id)
    
        
        prompt_template = ChatPromptTemplate.from_template(
            """You are an AI assistant for question-answering tasks. Use the following pieces of retrieved context, prior memory, and additional file content (if available) to provide a helpful and well-structured answer.

            **Previous Conversation History:**
            ```
            {memory}
            ```

            **User's Question (if provided):**
            ```
            {question}
            ```

            **Additional Context from Uploaded File (if provided):**
            ```
            {file_content}
            ```

            ---
            ### **Response Formatting Instructions:**  
            - Format the response using **Markdown** for better readability.  
            - Use **bold** for important points and *italics* for emphasis.  
            - Use `inline code` for technical terms or commands.  
            - Structure the response with **headings (##, ###)** where needed.  
            - Use **bullet points or numbered lists** for step-by-step instructions.  
            - Wrap code snippets inside triple backticks (```python for Python, ```json for JSON, etc.).

            ---
            ### **Handling Cases with No Explicit Question:**  
            - If the user provides a file but **does not ask a specific question**, prompt them by asking:  
            *"What specific information would you like to extract or summarize from this file?"*
            - Offer options like:
            - 🔹 *Summarize the document*
            - 🔹 *Extract key insights or important sections*
            - 🔹 *Answer questions based on file content*

            ---
            ### **Your Response:**  
            """
        )


        prompt = prompt_template.invoke({
            "memory": existing_summary,
            "question": query,
            "file_content":file_content
        })
        response = self.llm.invoke(prompt)
        return {"messages": state['messages'] + [response]}
    
    def write_memory(self, state, config):
        user_id = state["user_id"]
        conversation_id=state['conversation_id']
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