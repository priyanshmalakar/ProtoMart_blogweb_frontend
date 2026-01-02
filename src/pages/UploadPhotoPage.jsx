import React from 'react';
import PhotoUpload from '../components/photos/PhotoUpload';
import { useNavigate } from 'react-router-dom';

const UploadPhotoPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (photo) => {
    navigate('/my-photos');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PhotoUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
};

export default UploadPhotoPage;