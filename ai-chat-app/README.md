# AI Chat Application

This project is an AI-powered chat application that integrates a chat widget with real-time communication using WebSockets. The application consists of a React frontend, a Node.js backend, and a Python RAG (Retrieval-Augmented Generation) engine for processing queries.

## Project Structure

The project is organized into three main directories:

- **client**: Contains the React frontend application.
- **server**: Contains the Node.js backend application.
- **python-engine**: Contains the Python RAG engine.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Python (v3.7 or later)
- pip (Python package installer)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ai-chat-app
   ```

2. **Set up the client:**

   Navigate to the `client` directory and install the dependencies:

   ```bash
   cd client
   npm install
   ```

3. **Set up the server:**

   Navigate to the `server` directory and install the dependencies:

   ```bash
   cd server
   npm install
   ```

4. **Set up the Python engine:**

   Navigate to the `python-engine` directory and install the dependencies:

   ```bash
   cd python-engine
   pip install -r requirements.txt
   ```

### Configuration

- **MongoDB Connection**: Update the MongoDB connection string in `server/src/utils/db.js` to point to your MongoDB instance.

### Running the Application

1. **Start the MongoDB server** (if not already running).

2. **Start the backend server**:

   Navigate to the `server` directory and run:

   ```bash
   npm start
   ```

3. **Start the Python RAG engine**:

   Navigate to the `python-engine` directory and run:

   ```bash
   python src/rag_engine.py
   ```

4. **Start the React frontend**:

   Navigate to the `client` directory and run:

   ```bash
   npm start
   ```

### Usage

Once all components are running, open your browser and navigate to `http://localhost:3000` to access the chat application. You can send messages and interact with the AI-powered chat widget.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.