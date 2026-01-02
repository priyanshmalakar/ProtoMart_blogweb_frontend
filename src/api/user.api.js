import axiosInstance from './axios';

export const userAPI = {
  // Update profile
  updateProfile: async (data) => {
    return axiosInstance.put('/users/profile', data);
  },

  // Upload profile photo
  uploadProfilePhoto: async (formData) => {
    return axiosInstance.post('/users/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Delete profile photo
  deleteProfilePhoto: async () => {
    return axiosInstance.delete('/users/profile-photo');
  },

  // Get wallet balance
  getWallet: async () => {
    return axiosInstance.get('/users/wallet');
  },

  // Get transactions
  getTransactions: async (params) => {
    return axiosInstance.get('/users/transactions', { params });
  }
};