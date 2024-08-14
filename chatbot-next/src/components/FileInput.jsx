// FileInput.jsx
'use client';
import React, { forwardRef } from 'react';
import './FileInput.css';
import paperclipIcon from '../images/paperclip-icon.png';

// eslint-disable-next-line react/display-name
const FileInput = forwardRef(({ handleFileChange, className }, ref) => {
  return (
    <div className={`file-input-container ${className || ''}`}>
      <label htmlFor="fileInput" className="file-input-label">
        <img src={paperclipIcon} alt="Attach file" className="paperclip-icon" />
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        multiple
        className="file-input"
        ref={ref}
      />
    </div>
  );
});

// Add display name for better debugging
FileInput.displayName = 'FileInput';

export default FileInput;