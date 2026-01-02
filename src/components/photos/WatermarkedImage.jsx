import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';

const WatermarkedImage = ({ photo, size = 'medium', showActions = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = () => {
    switch (size) {
      case 'thumbnail':
        return photo.thumbnailUrl || photo.watermarkedUrl || photo.originalUrl;
      case 'medium':
        return photo.mediumUrl || photo.watermarkedUrl || photo.originalUrl;
      case 'large':
        return photo.watermarkedUrl || photo.originalUrl;
      default:
        return photo.watermarkedUrl || photo.originalUrl;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getImageUrl();
    link.download = photo.fileName || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group">
      {/* Loading Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      {/* Image */}
      <img
        src={getImageUrl()}
        alt={photo.placeName || 'Travel photo'}
        className={`w-full h-full object-cover rounded-lg transition-opacity ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />

      {/* Actions Overlay */}
      {showActions && imageLoaded && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => window.open(getImageUrl(), '_blank')}
            className="bg-white p-3 rounded-full hover:bg-gray-100 transition"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleDownload}
            className="bg-white p-3 rounded-full hover:bg-gray-100 transition"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WatermarkedImage;