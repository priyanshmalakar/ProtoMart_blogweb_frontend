import axiosInstance from './axios';

export const walletAPI = {
  // Get wallet balance
  getBalance: async () => {
    return axiosInstance.get('/users/wallet');
  },

  // Get transactions
  getTransactions: async (params) => {
    return axiosInstance.get('/users/transactions', { params });
  },

  // Redeem to ProtoMart
  redeemToProtoMart: async (amount) => {
    return axiosInstance.post('/users/redeem', { amount });
  },

  // Get ProtoMart balance
  getProtomartBalance: async () => {
    return axiosInstance.get('/wallet/protomart-balance');
  }
};