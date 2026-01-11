import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin.api';
import toast from 'react-hot-toast';

const RewardSettings = () => {
  const [rewardAmount, setRewardAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminAPI.getRewardSettings()
      .then((res) => {
        setRewardAmount(res.data.photoApprovalReward);
      })
      .catch(() => {
        toast.error('Failed to load reward settings');
      });
  }, []);

  const saveReward = async () => {
    if (rewardAmount < 0) {
      toast.error('Reward amount cannot be negative');
      return;
    }

    try {
      setLoading(true);
      await adminAPI.updateRewardSettings({
        photoApprovalReward: rewardAmount
      });
      toast.success('Reward updated successfully');
    } catch {
      toast.error('Failed to update reward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Photo Approval Reward</h2>
      <p className="text-sm text-gray-500 mb-4">
        This amount will be rewarded for every newly approved photo.
      </p>

      <input
        type="number"
        value={rewardAmount}
        onChange={(e) => setRewardAmount(Number(e.target.value))}
        className="w-full border rounded px-4 py-2 mb-4"
        placeholder="Enter reward amount (₹)"
      />

      <button
        onClick={saveReward}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Saving...' : 'Save Reward'}
      </button>
    </div>
  );
};

export default RewardSettings;
