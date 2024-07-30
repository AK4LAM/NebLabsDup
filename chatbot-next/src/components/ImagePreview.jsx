// ImagePreview.jsx
import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ imagePreview, removeImagePreview }) => {
  if (!imagePreview) return null;

  return (
    <div className="image-preview-container">
      <div className="image-preview-overlay">
        <img src={imagePreview} alt="Preview" className="blurred-image" />
        <button 
          onClick={removeImagePreview} 
          className="close-button"
          aria-label="Close preview"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;