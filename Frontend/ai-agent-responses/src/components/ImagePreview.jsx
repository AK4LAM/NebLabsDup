// ImagePreview.jsx
import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ imagePreview, setImagePreview }) => {
  return (
    <div className="image-preview-container">
      {imagePreview && (
        <div className="image-preview-overlay">
          <img src={imagePreview} alt="Image Preview" className="blurred-image" />
          <button onClick={() => setImagePreview(null)} className="close-button">X</button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
