// FileInput.jsx
import React from 'react';
import './FileInput.css';

const FileInput = ({ handleFileChange }) => {
  return (
    <div className="file-input-container">
      <label htmlFor="fileInput" className="file-input-label">
        <img src="/paperclip-icon.png" alt="Attach file" className="paperclip-icon" />
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        multiple
        className="file-input"
      />
    </div>
  );
};

export default FileInput;