import React from 'react';
import { Check, X, Eye, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const PhotoApproval = ({ photo, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={photo.originalUrl}
          alt="Pending approval"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => window.open(photo.originalUrl, '_blank')}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center mb-3">
          <img
            src={photo.userId?.profilePhoto || '/default-avatar.png'}
            alt={photo.userId?.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{photo.userId?.name}</p>
            <p className="text-xs text-gray-500">{photo.userId?.email}</p>
          </div>
        </div>

        {/* Location */}
        {photo.placeName && (
          <div className="flex items-center mb-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            <span className="truncate">
              {photo.placeName}
              {photo.city && `, ${photo.city}`}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center mb-3 text-xs text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{format(new Date(photo.createdAt), 'PPp')}</span>
        </div>

        {/* Photo Info */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          {photo.dimensions && (
            <div>Size: {photo.dimensions.width} × {photo.dimensions.height}</div>
          )}
          <div>File: {(photo.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
          {photo.source && (
            <div className="capitalize">Source: {photo.source.replace('_', ' ')}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(photo._id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => onReject(photo)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            <X className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoApproval;