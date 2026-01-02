import React from 'react';
import { MapPin, Calendar, Camera, Eye, Heart, User } from 'lucide-react';
import { format } from 'date-fns';

const PhotoDetail = ({ photo }) => {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Uploaded by</h3>
        <div className="flex items-center">
          <img
            src={photo.userId?.profilePhoto || '/default-avatar.png'}
            alt={photo.userId?.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">{photo.userId?.name}</p>
            <p className="text-sm text-gray-500">{photo.userId?.email}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      {photo.placeName && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">{photo.placeName}</p>
                {photo.city && <p className="text-sm text-gray-600">{photo.city}</p>}
                {photo.state && <p className="text-sm text-gray-600">{photo.state}</p>}
                {photo.country && <p className="text-sm text-gray-600">{photo.country}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Photo Details</h3>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-sm">
              Uploaded {format(new Date(photo.createdAt), 'PPP')}
            </span>
          </div>

          {photo.exifData?.camera && (
            <div className="flex items-center text-gray-600">
              <Camera className="w-5 h-5 mr-2" />
              <span className="text-sm">{photo.exifData.camera}</span>
            </div>
          )}

          {photo.dimensions && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Dimensions: </span>
              {photo.dimensions.width} × {photo.dimensions.height}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <span className="font-medium">Size: </span>
            {(photo.fileSize / (1024 * 1024)).toFixed(2)} MB
          </div>

          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-1" />
              <span>{photo.views || 0} views</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-1" />
              <span>{photo.likes || 0} likes</span>
            </div>
          </div>

          <div className="text-sm">
            <span className="font-medium">Status: </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                photo.approvalStatus === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : photo.approvalStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {photo.approvalStatus.charAt(0).toUpperCase() + photo.approvalStatus.slice(1)}
            </span>
          </div>

          {photo.rejectionReason && (
            <div className="text-sm text-red-600">
              <span className="font-medium">Reason: </span>
              {photo.rejectionReason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;