// FileInput.jsx
import React from 'react';
import './FileInput.css';
import paperclipIcon from '../images/paperclip-icon.png';

const FileInput = ({ handleFileChange }) => {
  return (
    <div className="file-input-container">
      <label htmlFor="fileInput" className="file-input-label">
        <img src={paperclipIcon} alt="Attach file" className="paperclip-icon" />
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