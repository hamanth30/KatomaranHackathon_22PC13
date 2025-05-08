import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('ws://localhost:5000'); // Replace with your WebSocket server URL
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, { ...message, type: 'received' }]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const message = { text: input, type: 'sent', timestamp: new Date().toLocaleTimeString() };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.send(JSON.stringify({ text: input }));
      setInput('');
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        backgroundImage: `url('./src/components/image.png')`, // Updated the path to the image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <div className="rounded-lg shadow-lg bg-white p-5 text-black font-bold text-xl">AI powered Chat assistant</div>
      <div className="chat-messages" style={{ padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.type === 'sent' ? 'chat-end' : 'chat-start'}`} style={{ margin: '10px' }}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src={
                    msg.type === 'sent'
                      ? 'https://img.daisyui.com/images/profile/demo/anakeen@192.webp'
                      : 'https://img.daisyui.com/images/profile/demo/kenobee@192.webp'
                  }
                />
              </div>
            </div>
            <div className="chat-header">
              {msg.type === 'sent' ? 'You' : 'AI'}
              <time className="text-xs opacity-50">{msg.timestamp}</time>
            </div>
            <div className="chat-bubble" style={{ maxWidth: '80%', marginLeft: '10px' }}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div
        className="chat-input"
        style={{
          position: 'absolute',
          bottom: '20px',
          width: '90%',
          left: '5%',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input input-bordered"
          style={{ flex: 1, padding: '10px', borderRadius: '5px' }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          style={{ padding: '10px 20px', borderRadius: '5px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;