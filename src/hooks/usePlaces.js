import { useQuery } from '@tanstack/react-query';
import { placesAPI } from '../api/places.api';

export const usePlaces = (params = {}) => {
  const { data: places, isLoading, error } = useQuery({
    queryKey: ['places', params],
    queryFn: () => placesAPI.getAllPlaces(params)
  });

  return {
    places: places?.data || [],
    isLoading,
    error
  };
};

export const usePlace = (id) => {
  const { data: place, isLoading, error } = useQuery({
    queryKey: ['place', id],
    queryFn: () => placesAPI.getPlaceById(id),
    enabled: !!id
  });

  const { data: placePhotos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['placePhotos', id],
    queryFn: () => placesAPI.getPlacePhotos(id, { page: 1, limit: 20 }),
    enabled: !!id
  });

  return {
    place: place?.data,
    photos: placePhotos?.data || [],
    isLoading,
    isLoadingPhotos,
    error
  };
};

export const usePlacesForMap = (bounds = {}) => {
  const { data: places, isLoading } = useQuery({
    queryKey: ['placesMap', bounds],
    queryFn: () => placesAPI.getPlacesForMap(bounds),
    enabled: Object.keys(bounds).length > 0
  });

  return {
    places: places?.data || [],
    isLoading
  };
};