import os
from dotenv import load_dotenv
from rag_engine import RAGEngine
from utils import parse_registration_data

def test_rag_engine():
    # Load environment variables
    load_dotenv()
    
    # Check if Google API key is set
    if not os.getenv("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable not set.")
        print("Please create a .env file with your Google API key.")
        return
    
    # Initialize the RAG engine
    print("Initializing RAG engine...")
    try:
        rag_engine = RAGEngine(data_dir="data")
        print("RAG engine initialized successfully.")
    except Exception as e:
        print(f"Error initializing RAG engine: {e}")
        return
    
    # Test queries
    test_queries = [
        "Who was the last person registered?",
        "How many people are currently registered?",
        "When did John Smith register?",
        "List all inactive registrations",
        "What is the registration ID of Emily Johnson?"
    ]
    
    # Process each test query
    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            answer = rag_engine.answer_query(query)
            print(f"Answer: {answer}")
        except Exception as e:
            print(f"Error processing query: {e}")

if __name__ == "__main__":
    test_rag_engine()
