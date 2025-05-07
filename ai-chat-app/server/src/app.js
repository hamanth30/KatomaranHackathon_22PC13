import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './utils/db.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use('/api/chat', chatRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle incoming messages
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });
});

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});