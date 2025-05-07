from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import OpenAI
from flask import Flask, request, jsonify
import os
import logging

class RAGEngine:
    def __init__(self):
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            logging.warning("OPENAI_API_KEY environment variable is not set. Please set it to use OpenAI services.")
            raise ValueError("OPENAI_API_KEY environment variable is not set.")

        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

        # Check if FAISS index exists, create if not
        index_path = "faiss_index"
        if not os.path.exists(index_path):
            os.makedirs(index_path)
            self.vector_store = FAISS.from_texts(["Sample text for FAISS index"], self.embeddings)
            self.vector_store.save_local(index_path)
        else:
            self.vector_store = FAISS.load_local(index_path, self.embeddings, allow_dangerous_deserialization=True)

        self.llm = OpenAI(temperature=0, openai_api_key=openai_api_key)
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever()
        )

    def query(self, user_input):
        response = self.qa_chain.run(user_input)
        return response

app = Flask(__name__)
rag_engine = RAGEngine()

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    user_query = data.get('query', '')

    if not user_query:
        return jsonify({"error": "Query is required"}), 400

    try:
        response = rag_engine.query(user_query)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)