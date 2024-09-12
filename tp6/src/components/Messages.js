// Messages.js
import React from 'react';
import './Messages.css';

const Messages = ({ messages }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.isError ? "error-message" : "success-message"}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default Messages;
