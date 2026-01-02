import React from 'react';
import { MapPin, Image as ImageIcon, Eye } from 'lucide-react';

const PlaceDetail = ({ place }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {place.name}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>
              {place.city && `${place.city}, `}
              {place.state && `${place.state}, `}
              {place.country}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <div className="flex items-center">
            <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-blue-600">
              {place.photoCount || 0}
            </span>
            <span className="text-gray-600 ml-2">Photos</span>
          </div>
        </div>
      </div>

      {place.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{place.description}</p>
        </div>
      )}

      {place.totalViews > 0 && (
        <div className="flex items-center text-gray-600">
          <Eye className="w-5 h-5 mr-2" />
          <span>{place.totalViews.toLocaleString()} total views</span>
        </div>
      )}
    </div>
  );
};

export default PlaceDetail;