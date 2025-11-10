import { useState } from 'react';
import { FaUpload, FaTimes, FaImage } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ images = [], onImagesChange }) => {
  const [previews, setPreviews] = useState(images);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...newPreviews];

    setPreviews(updatedPreviews);
    onImagesChange(imageFiles);
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div className="image-upload">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="image-upload" className="upload-label">
          <FaUpload className="upload-icon" />
          <p>Resimleri sürükle bırak veya tıkla</p>
          <span>PNG, JPG, GIF, WEBP (Maks. 5 resim)</span>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="image-previews">
          {previews.map((preview, index) => (
            <div key={index} className="preview-item">
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeImage(index)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
