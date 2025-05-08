import os
import sys
from rag_engine import RAGEngine
from utils import parse_registration_data
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    
    # Check if Google API key is set
    if not os.getenv("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable not set.")
        print("Please create a .env file with your Google API key.")
        print("Example: GOOGLE_API_KEY=your_api_key_here")
        sys.exit(1)
    
    # Initialize the RAG engine
    print("Initializing RAG engine...")
    try:
        rag_engine = RAGEngine(data_dir="data")
        print("RAG engine initialized successfully.")
    except Exception as e:
        print(f"Error initializing RAG engine: {e}")
        sys.exit(1)
    
    # Simple command-line interface
    print("\nRAG Chatbot with LangChain and Google Gemini")
    print("Type 'exit' to quit the application.")
    print("Example questions:")
    print("- Who was the last person registered?")
    print("- How many people are currently registered?")
    print("- When did John Smith register?")
    
    while True:
        # Get user query
        query = input("\nEnter your question: ")
        
        # Exit condition
        if query.lower() in ["exit", "quit", "q"]:
            print("Exiting application. Goodbye!")
            break
        
        # Process the query
        if query.strip():
            print("\nProcessing your question...")
            try:
                answer = rag_engine.answer_query(query)
                print(f"\nAnswer: {answer}")
            except Exception as e:
                print(f"Error processing query: {e}")

if __name__ == "__main__":
    main()