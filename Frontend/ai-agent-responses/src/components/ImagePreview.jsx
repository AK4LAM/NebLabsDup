// ImagePreview.jsx
import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ imagePreview, setImagePreview }) => {
  if (!imagePreview) return null;

  return (
    <div className="image-preview-container">
      <div className="image-preview-overlay">
        <img src={imagePreview} alt="Preview" className="blurred-image" />
        <button 
          onClick={() => setImagePreview(null)} 
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