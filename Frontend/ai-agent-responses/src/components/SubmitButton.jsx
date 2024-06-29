import React from 'react';
import './SubmitButton.css'; // Import the CSS file

const SubmitButton = ({ isLoading }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`submit-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : 'Submit'}
    </button>
  );
};

export default SubmitButton;