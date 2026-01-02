import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { placesAPI } from '../../api/places.api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';


// Custom marker icon
const createCustomIcon = (photoCount) => {
  const size = Math.min(40 + photoCount * 2, 60);
  
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(14 + photoCount, 20)}px;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${photoCount}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Component to add marker cluster
const MarkerClusterGroup = ({ children }) => {
  const map = useMap();
  const clusterRef = useRef(null);

  useEffect(() => {
    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `
              <div style="
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 16px;
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
              ">
                ${count}
              </div>
            `,
            className: 'marker-cluster-custom',
            iconSize: [50, 50]
          });
        }
      });
      map.addLayer(clusterRef.current);
    }

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (clusterRef.current) {
      clusterRef.current.clearLayers();
      React.Children.forEach(children, (child) => {
        if (child && child.props.position) {
          const marker = L.marker(child.props.position, {
            icon: child.props.icon
          });
          
          if (child.props.children) {
            marker.bindPopup(child.props.children.props.children);
          }
          
          if (child.props.eventHandlers) {
            Object.entries(child.props.eventHandlers).forEach(([event, handler]) => {
              marker.on(event, handler);
            });
          }
          
          clusterRef.current.addLayer(marker);
        }
      });
    }
  }, [children]);

  return null;
};

const PlacesMap = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, [mapBounds]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      
      const params = mapBounds ? {
        minLat: mapBounds.minLat,
        maxLat: mapBounds.maxLat,
        minLng: mapBounds.minLng,
        maxLng: mapBounds.maxLng
      } : {};

      const response = await placesAPI.getPlacesForMap(params);
      setPlaces(response.data);
    } catch (error) {
      toast.error('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const handleMapMove = (bounds) => {
    setMapBounds({
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast()
    });
  };

  const MapEventHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleMove = () => {
        handleMapMove(map.getBounds());
      };

      map.on('moveend', handleMove);
      map.on('zoomend', handleMove);

      return () => {
        map.off('moveend', handleMove);
        map.off('zoomend', handleMove);
      };
    }, [map]);

    return null;
  };

  return (
    <div className="relative w-full h-screen">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">Loading places...</p>
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventHandler />

        <MarkerClusterGroup>
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createCustomIcon(place.photoCount)}
              eventHandlers={{
                click: () => {
                  navigate(`/places/${place.id}`);
                }
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                  <p className="text-sm text-gray-600">
                    {place.city && `${place.city}, `}
                    {place.state && `${place.state}, `}
                    {place.country}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {place.photoCount} {place.photoCount === 1 ? 'photo' : 'photos'}
                  </p>
                  <button
                    onClick={() => navigate(`/places/${place.id}`)}
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    View Place
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mr-2"></div>
            <span>Single Place</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-red-500 mr-2"></div>
            <span>Multiple Places</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click markers to view photos
        </p>
      </div>
    </div>
  );
};

export default PlacesMap;