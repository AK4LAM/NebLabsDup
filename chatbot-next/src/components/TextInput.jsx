'use client';
// TextInput.jsx
import React from 'react';
import './TextInput.css';

const TextInput = ({ textInput, handleTextChange }) => {
  return (
    <div className="text-input-container">
      <input
        type="text"
        id="textInput"
        value={textInput}
        onChange={handleTextChange}
        className="text-input"
        placeholder="Enter your message"
        aria-label="Text input for customer support message"
      />
    </div>
  );
};

export default TextInput;