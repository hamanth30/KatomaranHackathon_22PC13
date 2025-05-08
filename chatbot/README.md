# RAG Chatbot with LangChain and Google Gemini

This project implements a Retrieval-Augmented Generation (RAG) chatbot using LangChain, FAISS vector database, and Google's Gemini API. The chatbot can answer queries about registrations by retrieving relevant information from a knowledge base.

## Features

- Document loading and processing
- Vector embeddings with FAISS for efficient similarity search
- Integration with Google Gemini for natural language generation
- Query handling for registration-related questions

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

3. Prepare your document data in the `data` directory

4. Run the application:
   ```
   python app.py
   ```

## Usage

After starting the application, you can ask questions about registrations such as:
- "Who was the last person registered?"
- "How many people are currently registered?"
- "When did John Smith register?"

## Project Structure

- `app.py`: Main application entry point
- `rag_engine.py`: Core RAG implementation with LangChain and FAISS
- `data/`: Directory for storing document files
- `utils.py`: Utility functions for data processing

## Requirements

See `requirements.txt` for a complete list of dependencies.