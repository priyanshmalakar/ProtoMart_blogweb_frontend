import React, { useEffect, useState } from 'react';
import { walletAPI } from '../../api/wallet.api';
import { Wallet, TrendingUp, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletBalance = ({ onRedeemClick }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await walletAPI.getBalance();
      setBalance(response.data.balance);
    } catch (error) {
      toast.error('Failed to load wallet balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white animate-pulse">
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Wallet className="w-8 h-8 mr-3" />
          <div>
            <p className="text-sm opacity-90">Wallet Balance</p>
            <p className="text-3xl font-bold">₹ {balance.toFixed(2)}</p>
          </div>
        </div>
        
        <Gift className="w-12 h-12 opacity-30" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>Earn more by uploading photos!</span>
        </div>
        
        <button
          onClick={onRedeemClick}
          disabled={balance < 10}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redeem
        </button>
      </div>

      {balance < 10 && (
        <p className="text-xs mt-2 opacity-75">
          Minimum ₹10 required for redemption
        </p>
      )}
    </div>
  );
};

export default WalletBalance;