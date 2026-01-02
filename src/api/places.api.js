import axiosInstance from './axios';

export const placesAPI = {
  // Get all places
  getAllPlaces: async (params) => {
    return axiosInstance.get('/places', { params });
  },

  // Get places for map
  getPlacesForMap: async (bounds) => {
    return axiosInstance.get('/places/map', { params: bounds });
  },

  // Get place by ID
  getPlaceById: async (id) => {
    return axiosInstance.get(`/places/${id}`);
  },

  // Get place photos
  getPlacePhotos: async (id, params) => {
    return axiosInstance.get(`/places/${id}/photos`, { params });
  }
};