import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Upload, X, Menu } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import toast from "react-hot-toast";
import { placesAPI } from "../api/places.api";
import { photosAPI } from "../api/photos.api";
const PhotoMap = ({ onLocationSelect, refreshKey, photos, loading }) => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Could not get location:", error);
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
          clickedElement?.closest(".leaflet-marker-icon") ||
          clickedElement?.closest(".leaflet-popup") ||
          clickedElement?.closest(".leaflet-control") ||
          clickedElement?.closest("button")
        ) {
          return;
        }

        onMapClick(e.latlng);
      };

      map.on("click", handleClick);

      return () => {
        map.off("click", handleClick);
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
      className: "user-location-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="w-full h-full"
      style={{ minHeight: "500px" }}
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
              <div className="text-center p-2" style={{ minWidth: "250px" }}>
                <h3 className="font-semibold text-sm mb-2">
                  {place.placeName || "Unknown Location"}
                </h3>

                <p className="text-xs text-gray-600 mb-3">
                  {place.city && `${place.city}, `}
                  {place.state && `${place.state}, `}
                  {place.country}
                </p>

                <p className="text-xs text-blue-600 font-semibold mb-3">
                  📸 {photoCount} photo{photoCount !== 1 ? "s" : ""}
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
    className: "custom-photo-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
          toast.success("Moved to your location!");
        },
        (error) => {
          toast.error("Unable to get your location");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-16 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      )}
    </button>
  );
};
function MapPage() {
  const navigate = useNavigate();
 
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalPlaces: 0,
    totalUsers: 0,
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
        totalUsers: 50,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchApprovedPhotos = async () => {
    try {
      setLoading(true);
      const response = await photosAPI.getPlacesWithPhotos({
        status: "approved",
        limit: 1000,
      });
      setPhotos(response.data || []);
    } catch (error) {
      console.error("Failed to load photos:", error);
      toast.error("Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
    setShowUploadModal(true);
  };

  return (
    <div>
      <PhotoMap
        key={refreshKey}
        refreshKey={refreshKey}
        onLocationSelect={handleLocationSelect}
        photos={photos}
        loading={loading}
      />
    </div>
  );
}

export default MapPage;
