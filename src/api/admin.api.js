import axiosInstance from './axios';

/**
 * Admin APIs
 * All admin related backend calls
 */
export const adminAPI = {
  /**
   * =========================
   * DASHBOARD / STATS
   * =========================
   */

  // Get admin dashboard stats
  getStats: async () => {
    return axiosInstance.get('/admin/stats');
  },

  /**
   * =========================
   * PHOTO APPROVAL
   * =========================
   */

  // Get pending photos
  getPendingPhotos: async ({ page = 1, limit = 20 }) => {
    return axiosInstance.get('/admin/photos/pending', {
      params: { page, limit }
    });
  },

  /**
   * Approve photo
   * @param {string} photoId
   * @param {number} rewardAmount (optional)
   *
   * 👉 rewardAmount na bhejo to backend default reward use karega
   */
  approvePhoto: async (photoId, rewardAmount) => {
    return axiosInstance.post(`/admin/photos/${photoId}/approve`, {
      rewardAmount // optional
    });
  },

  /**
   * Reject photo
   * @param {string} photoId
   * @param {string} reason
   */
  rejectPhoto: async (photoId, reason) => {
    return axiosInstance.post(`/admin/photos/${photoId}/reject`, {
      reason
    });
  },

  /**
   * =========================
   * REWARD SETTINGS
   * =========================
   */

  // Get reward settings (per photo reward, min redemption, etc.)
  getRewardSettings: async () => {
    return axiosInstance.get('/admin/rewards/settings');
  },

  /**
   * Update reward settings
   * @param {Object} data
   * {
   *   photoApprovalReward: number,
   *   minimumRedemptionAmount: number
   * }
   */
  updateRewardSettings: async (data) => {
    return axiosInstance.put('/admin/rewards/settings', data);
  },

  /**
   * =========================
   * WATERMARK SETTINGS (existing)
   * =========================
   */

  // Get watermark settings
  getWatermarkSettings: async () => {
    return axiosInstance.get('/admin/watermark');
  },

  // Update watermark settings
  updateWatermarkSettings: async (data) => {
    return axiosInstance.put('/admin/watermark', data);
  }
};

export default adminAPI;
