// Chat.jsx
import React from 'react';
import './Chat.css';

const Chat = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default Chat;