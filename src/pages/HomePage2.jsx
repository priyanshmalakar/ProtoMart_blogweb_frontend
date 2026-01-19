import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, X, Menu } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import useAuthStore from '../store/authStore';
import { placesAPI } from '../api/places.api';
import { photosAPI } from '../api/photos.api';
import toast from 'react-hot-toast';
import UploadModal from '../components/photos/UploadModal';
import image1 from '../assets/image.jpg'; 
import ExplorePage from './ExplorePage';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

// Custom marker icon for approved photos
const createPhotoMarker = (count) => {
  const size = Math.min(30 + count * 2, 50);
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(12 + count, 16)}px;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${count}
      </div>
    `,
    className: 'custom-photo-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const LocationButton = () => {
  const map = useMap();
  
  const goToMyLocation = (e) => {
    e.stopPropagation();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          toast.success('Moved to your location!');
        },
        (error) => {
          toast.error('Unable to get your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  return (
    <button
      onClick={goToMyLocation}
      className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      title="Go to my location"
    >
      <MapPin className="w-5 h-5 text-blue-600" />
    </button>
  );
};

const FullscreenButton = () => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    
    const mapContainer = map.getContainer().parentElement;
    
    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-16 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  );
};

const PhotoMap = ({ onLocationSelect, refreshKey, photos, loading }) => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Could not get location:', error);
        }
      );
    }
  }, []);

  const MapClickHandler = ({ onMapClick }) => {
    const map = useMap();
    
    useEffect(() => {
      const handleClick = (e) => {
        const clickedElement = e.originalEvent?.target;
        
        if (
          clickedElement?.closest('.leaflet-marker-icon') ||
          clickedElement?.closest('.leaflet-popup') ||
          clickedElement?.closest('.leaflet-control') ||
          clickedElement?.closest('button')
        ) {
          return;
        }
        
        onMapClick(e.latlng);
      };
      
      map.on('click', handleClick);
      
      return () => {
        map.off('click', handleClick);
      };
    }, [map, onMapClick]);
    
    return null;
  };

  const createUserLocationMarker = () => {
    return L.divIcon({
      html: `
        <div style="
          background: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 0 0 2px #3b82f6, 0 2px 6px rgba(0,0,0,0.4);
        "></div>
      `,
      className: 'user-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onLocationSelect} />
      <LocationButton />
      <FullscreenButton />

      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          Loading photos...
        </div>
      )}

      {photos.map((place) => {
        if (!place.location || !place.location.coordinates) return null;
        
        const [lng, lat] = place.location.coordinates;
        const photoCount = place.photoCount || 0;
        
        return (
          <Marker
            key={place.placeId}
            position={[lat, lng]}
            icon={createPhotoMarker(photoCount)}
          >
            <Popup>
              <div className="text-center p-2" style={{ minWidth: '250px' }}>
                <h3 className="font-semibold text-sm mb-2">
                  {place.placeName || 'Unknown Location'}
                </h3>
                
                <p className="text-xs text-gray-600 mb-3">
                  {place.city && `${place.city}, `}
                  {place.state && `${place.state}, `}
                  {place.country}
                </p>

                <p className="text-xs text-blue-600 font-semibold mb-3">
                  📸 {photoCount} photo{photoCount !== 1 ? 's' : ''}
                </p>

                {place.photos && place.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {place.photos.slice(0, 3).map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo.originalUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                
                <button
                  onClick={() => navigate(`/places/${place.placeId}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition w-full"
                >
                  View All Photos
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserLocationMarker()}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">You are here</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};



const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalPlaces: 0,
    totalUsers: 0
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchApprovedPhotos();
  }, []);

  const fetchStats = async () => {
    try {
      const placesResponse = await placesAPI.getAllPlaces({ limit: 1 });
      setStats({
        totalPhotos: placesResponse.pagination?.totalPhotos || 10000,
        totalPlaces: placesResponse.pagination?.totalPlaces || 55,
        totalUsers: 50
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchApprovedPhotos = async () => {
    try {
      setLoading(true);
      const response = await photosAPI.getPlacesWithPhotos({ 
        status: 'approved',
        limit: 1000
      });
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Failed to load photos:', error);
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({
      latitude: latlng.lat,
      longitude: latlng.lng
    });
    setShowUploadModal(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {showUploadModal && selectedLocation && (
        <UploadModal 
          coordinates={selectedLocation}
          onClose={() => {
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Hero Section with Blue Background */}
      <div className="text-black font-bold py-8" style={{ backgroundImage: `url(${image1})` , backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
            Explore the world in seconds with high resolution
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            photos & travel advisory of many places free of cost
          </h2>
          
          <div className="mb-4">
            <p className="text-lg mb-2">
              Total {(stats.totalPhotos / 1000).toFixed(0)}k high resolution photos of {stats.totalPlaces} places uploaded by {stats.totalUsers} users
            </p>
            <p className="text-base">
              Get paid 1 rs / .01 USD for uploading 4 photos in your proto wallet
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-base mb-4">
            <button
              onClick={() => navigate('/explore')}
              className="hover:underline font-semibold"
            >
              Explore Photos
            </button>
            <span>|</span>
            <button
              onClick={() => navigate('/map')}
              className="hover:underline font-semibold"
            >
              Explore photos by map
            </button>
            <span>|</span>
            <button
              onClick={() => navigate('/upload')}
              className="hover:underline font-semibold"
            >
              Upload Photos
            </button>
            <span>|</span>
            <button
              onClick={() => navigate('/blog')}
              className="hover:underline font-semibold"
            >
              Write blog
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search photo by place, type, date, etc.."
              className="w-full px-6 py-2 rounded-full text-gray-800 text-base"
            />
          </div>
        </div>
      </div>

      {/* File Explorer and Photo Grid Section */}
      <div className=" mx-auto px-4 py-8">
        <ExplorePage/>
      </div>

      {/* Interactive Map Section */}
      <div className=" mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-xl mb-4">🗺️ Interactive Map</h3>
          <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
            <PhotoMap 
              key={refreshKey} 
              refreshKey={refreshKey} 
              onLocationSelect={handleLocationSelect}
              photos={photos}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section with Forest Images */}
      <div className="relative">
        {/* First Forest Image Section */}
        <div 
          className="relative h-[100vh] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${image2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                Share Your World Vision with all
              </h2>
              <p className="text-xl md:text-2xl font-semibold mb-2">
                Upload Photos | Write your experience about places
              </p>
              <p className="text-lg md:text-xl">
                Transform your travel memories into rewards. Upload stunning photos, earn real money, and inspire explorers worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Second Forest Image Section */}
        <div 
          className="relative h-[100vh] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${image3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Join thousands of travelers sharing their experiences
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-xl"
            >
              Create Free Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;