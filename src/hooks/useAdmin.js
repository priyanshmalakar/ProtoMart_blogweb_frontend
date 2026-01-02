import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../api/admin.api';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminAPI.getStats
  });

  const { data: pendingPhotos, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingPhotos'],
    queryFn: () => adminAPI.getPendingPhotos({ page: 1, limit: 20 })
  });

  const { data: watermarkSettings, isLoading: isLoadingWatermark } = useQuery({
    queryKey: ['watermarkSettings'],
    queryFn: adminAPI.getWatermarkSettings
  });

  const approveMutation = useMutation({
    mutationFn: adminAPI.approvePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingPhotos']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('Photo approved! Reward credited to user.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve photo');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => adminAPI.rejectPhoto(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingPhotos']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('Photo rejected');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject photo');
    }
  });

  const updateWatermarkMutation = useMutation({
    mutationFn: adminAPI.updateWatermarkSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['watermarkSettings']);
      toast.success('Watermark settings updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update watermark settings');
    }
  });

  return {
    stats: stats?.data,
    pendingPhotos: pendingPhotos?.data || [],
    watermarkSettings: watermarkSettings?.data,
    isLoadingStats,
    isLoadingPending,
    isLoadingWatermark,
    approvePhoto: approveMutation.mutate,
    rejectPhoto: rejectMutation.mutate,
    updateWatermarkSettings: updateWatermarkMutation.mutate,
    isApproving: approveMutation.isLoading,
    isRejecting: rejectMutation.isLoading,
    isUpdatingWatermark: updateWatermarkMutation.isLoading
  };
};