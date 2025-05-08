import os
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

class RAGEngine:
    def __init__(self, data_dir="data", model_name="gemini-pro", embedding_model="models/embedding-001"):
        # Load environment variables
        load_dotenv()
        
        # Set up Google Gemini API
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        
        self.data_dir = data_dir
        self.model_name = model_name
        self.embedding_model = embedding_model
        self.vector_store = None
        self.qa_chain = None
        
        # Initialize the RAG components
        self._initialize_rag()
    
    def _initialize_rag(self):
        """Initialize the RAG components: document loading, splitting, embeddings, and retrieval"""
        # Load documents
        documents = self._load_documents()
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = text_splitter.split_documents(documents)
        
        # Create embeddings and vector store
        embeddings = GoogleGenerativeAIEmbeddings(model=self.embedding_model)
        self.vector_store = FAISS.from_documents(splits, embeddings)
        
        # Create prompt template
        template = """
        You are an assistant that answers questions about registrations based on the provided context.
        
        Context: {context}
        
        Question: {question}
        
        Answer the question based only on the provided context. If the answer cannot be found in the context, 
        say "I don't have enough information to answer this question." Don't make up any information.
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )
        
        # Create LLM
        llm = ChatGoogleGenerativeAI(model=self.model_name, temperature=0.2)
        
        # Create QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": prompt}
        )
    
    def _load_documents(self):
        """Load documents from the data directory"""
        try:
            # Create data directory if it doesn't exist
            os.makedirs(self.data_dir, exist_ok=True)
            
            # Load all text files from the data directory
            loader = DirectoryLoader(self.data_dir, glob="**/*.txt", loader_cls=TextLoader)
            documents = loader.load()
            
            if not documents:
                print(f"Warning: No documents found in {self.data_dir}")
            
            return documents
        except Exception as e:
            print(f"Error loading documents: {e}")
            return []
    
    def answer_query(self, query):
        """Answer a query using the RAG system"""
        if not self.qa_chain:
            return "RAG system not initialized properly."
        
        try:
            result = self.qa_chain.invoke({"query": query})
            return result["result"]
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def refresh_knowledge_base(self):
        """Refresh the knowledge base by reloading documents and recreating the vector store"""
        self._initialize_rag()
        return "Knowledge base refreshed successfully."