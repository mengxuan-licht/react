// GalleryView.jsx
import React from 'react';

export default function GalleryView({ images, isAdmin, onEdit }) {
  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-header">
      </div>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`作品${index + 1}`} />
        ))}
      </div>
    </section>
  );
}
