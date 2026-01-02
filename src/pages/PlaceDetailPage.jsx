import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { placesAPI } from '../api/places.api';
import { MapPin, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import PhotoGrid from '../components/photos/PhotoGrid';
import toast from 'react-hot-toast';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [place, setPlace] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(true);

  useEffect(() => {
    fetchPlace();
    fetchPlacePhotos();
  }, [id]);

  const fetchPlace = async () => {
    try {
      setLoading(true);
      const response = await placesAPI.getPlaceById(id);
      setPlace(response.data);
    } catch (error) {
      toast.error('Failed to load place');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacePhotos = async () => {
    try {
      setPhotosLoading(true);
      const response = await placesAPI.getPlacePhotos(id, { page: 1, limit: 20 });
      setPhotos(response.data);
    } catch (error) {
      toast.error('Failed to load photos');
    } finally {
      setPhotosLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Map
          </button>
        </div>
      </div>

      {/* Place Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
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
                  {place.photoCount}
                </span>
                <span className="text-gray-600 ml-2">Photos</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <p className="mt-4 text-gray-700">{place.description}</p>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-96">
            <MapContainer
              center={[place.location.coordinates[1], place.location.coordinates[0]]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[place.location.coordinates[1], place.location.coordinates[0]]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.city}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Photos from {place.name}</h2>
        <PhotoGrid photos={photos} loading={photosLoading} />
      </div>
    </div>
  );
};

export default PlaceDetailPage;