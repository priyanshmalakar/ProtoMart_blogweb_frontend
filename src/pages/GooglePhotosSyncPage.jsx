import React from 'react';
import GooglePhotosSync from '../components/googlePhotos/GooglePhotosSync';
import SyncStatus from '../components/googlePhotos/SyncStatus';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GooglePhotosSyncPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-photos')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to My Photos
        </button>

        {/* Sync Status */}
        <div className="mb-8">
          <SyncStatus />
        </div>

        {/* Sync Component */}
        <GooglePhotosSync />
      </div>
    </div>
  );
};

export default GooglePhotosSyncPage;