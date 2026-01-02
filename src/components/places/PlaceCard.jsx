import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Image as ImageIcon } from 'lucide-react';

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/places/${place._id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Cover Photo */}
      {place.coverPhoto && (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img
            src={place.coverPhoto}
            alt={place.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">
            {place.city && `${place.city}, `}
            {place.state && `${place.state}, `}
            {place.country}
          </span>
        </div>

        {place.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {place.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center text-blue-600">
            <ImageIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">{place.photoCount || 0} Photos</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View Place →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;