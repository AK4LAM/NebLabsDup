// FileInput.jsx
import React, { forwardRef } from 'react';
import './FileInput.css';
import paperclipIcon from '../images/paperclip-icon.png';

// Use forwardRef to forward the ref to the input element
const FileInput = forwardRef(({ handleFileChange }, ref) => {
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
        ref={ref} // Forward the ref to the input element
      />
    </div>
  );
});

export default FileInput;
