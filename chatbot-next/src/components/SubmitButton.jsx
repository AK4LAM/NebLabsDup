// SubmitButton.jsx
import React from 'react';
import './SubmitButton.css';

const SubmitButton = ({ isLoading }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="submit-button"
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
