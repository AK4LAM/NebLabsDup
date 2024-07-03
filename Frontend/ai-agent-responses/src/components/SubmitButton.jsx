// SubmitButton.jsx
import React from 'react';
import './SubmitButton.css';

const SubmitButton = ({ isLoading }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`submit-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <span className="spinner"></span>
      ) : (
        <span className="arrow">↑</span>
      )}
    </button>
  );
};

export default SubmitButton;