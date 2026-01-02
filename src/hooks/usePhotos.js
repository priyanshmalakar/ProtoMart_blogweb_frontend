import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photosAPI } from '../api/photos.api';
import toast from 'react-hot-toast';

export const usePhotos = (params = {}) => {
  const queryClient = useQueryClient();

  const { data: photos, isLoading, error } = useQuery({
    queryKey: ['photos', params],
    queryFn: () => photosAPI.getPhotos(params)
  });

  const { data: myPhotos, isLoading: isLoadingMyPhotos } = useQuery({
    queryKey: ['myPhotos', params],
    queryFn: () => photosAPI.getMyPhotos(params)
  });

  const uploadMutation = useMutation({
    mutationFn: photosAPI.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['photos']);
      queryClient.invalidateQueries(['myPhotos']);
      toast.success('Photo uploaded successfully! Waiting for approval.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload photo');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: photosAPI.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['photos']);
      queryClient.invalidateQueries(['myPhotos']);
      toast.success('Photo deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete photo');
    }
  });

  const likeMutation = useMutation({
    mutationFn: photosAPI.likePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['photos']);
      toast.success('Photo liked!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to like photo');
    }
  });

  return {
    photos: photos?.data || [],
    myPhotos: myPhotos?.data || [],
    isLoading,
    isLoadingMyPhotos,
    uploadPhoto: uploadMutation.mutate,
    deletePhoto: deleteMutation.mutate,
    likePhoto: likeMutation.mutate,
    isUploading: uploadMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};

export const usePhotoById = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['photo', id],
    queryFn: () => photosAPI.getPhotoById(id),
    enabled: !!id
  });

  return {
    photo: data?.data,
    isLoading,
    error
  };
};