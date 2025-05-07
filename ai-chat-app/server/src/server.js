import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import { connectDB } from './utils/db.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

app.use(express.json());
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (message) => {
    console.log('Message received from client:', message);

    try {
      // Forward the message to the Python RAG engine
      const response = await axios.post('http://localhost:8000/query', { query: message });

      // Send the RAG engine's response back to the client
      socket.emit('receiveMessage', response.data);
    } catch (error) {
      console.error('Error communicating with RAG engine:', error.message);
      socket.emit('receiveMessage', { error: 'Failed to get a response from the AI engine.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});