from langchain_community.document_loaders import PyPDFLoader
import os
from langchain_openai import ChatOpenAI
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .config import get_settings

load_dotenv()
OPENAI_API_KEY=os.environ.get('OPENAI_API_KEY')

def pdf_loader(directory='temp'):
    """
    To load the data from pdfs
    """
      
    loader = DirectoryLoader(
    f"./{directory}",
    glob=["**/*.doc", "**/*.docx", "**/*.ppt", "**/*.pptx", "**/*.pdf","**/*.txt"],  # Include desired file types
    show_progress=True
)
    docs = loader.load()
    print(f"Number of documents loaded: {len(docs)}")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )

    split_docs = []
    for doc in docs:
        # Preserve metadata for each document
        splits = text_splitter.create_documents(
            texts=[doc.page_content],
            metadatas=[doc.metadata],
        )
        split_docs.extend(splits)
        # Set a really small chunk size, just to show.
    print(f"Number of split_docs documents loaded: {len(split_docs)}")
    return split_docs

def create_embed(all_docs,persist_directory='chroma_db'):
    """
    To create the embeddings from documents
    """
    vectorstore = Chroma.from_documents(
    documents=all_docs,
    embedding=OpenAIEmbeddings(),
    persist_directory=persist_directory,
    )
    return vectorstore


def load_vectorstore(persist_directory="chroma_db"):
    """
    Load the persisted vectorstore from disk
    """
    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=OpenAIEmbeddings(),
    )
    print(f"Vectorstore loaded from directory: {persist_directory}")
    return vectorstore

def generate_summary(previous_summary, new_messages):
    settings = get_settings()
    llm = ChatOpenAI(model=settings.MODEL_NAME)
    OPENAI_API_KEY = settings.OPENAI_API_KEY

    # Construct the prompt for generating the summary
    prompt = f"""
    Given the following previous conversation summary and new messages, generate an updated summary:

    Previous Summary:
    {previous_summary}

    New Messages:
    {new_messages}

    Please summarize the key points and main context from the conversation so far.
    """

    # Pass the prompt to the model to generate the updated summary
    response = llm.invoke(prompt)
    return response.content