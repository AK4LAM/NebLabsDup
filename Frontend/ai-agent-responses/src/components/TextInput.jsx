// TextInput.jsx
import React from 'react';

const TextInput = ({ textInput, handleTextChange }) => {
  return (
    <div className="transition-all duration-300 focus-within:scale-105">
      <label htmlFor="textInput" className="block text-sm font-medium text-gray-600 mb-1">
        Text Input
      </label>
      <input
        type="text"
        id="textInput"
        value={textInput}
        onChange={handleTextChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
        placeholder="Enter your message"
      />
    </div>
  );
};

export default TextInput;