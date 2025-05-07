import React from 'react';

const Message = ({ message, sender }) => {
  return (
    <div className={`chat ${sender === 'user' ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User Avatar"
            src={sender === 'user' ? 'https://img.daisyui.com/images/profile/demo/anakeen@192.webp' : 'https://img.daisyui.com/images/profile/demo/kenobee@192.webp'}
          />
        </div>
      </div>
      <div className="chat-header">
        {sender === 'user' ? 'You' : 'AI'}
        <time className="text-xs opacity-50">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
      </div>
      <div className="chat-bubble">{message}</div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};

export default Message;