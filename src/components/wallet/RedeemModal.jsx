import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { walletAPI } from '../../api/wallet.api';
import toast from 'react-hot-toast';

const RedeemModal = ({ isOpen, onClose, currentBalance, onRedeemSuccess }) => {
  const [amount, setAmount] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = async () => {
    const redeemAmount = parseFloat(amount);

    if (!redeemAmount || redeemAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (redeemAmount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (redeemAmount < 10) {
      toast.error('Minimum redemption amount is ₹10');
      return;
    }

    try {
      setRedeeming(true);
      const response = await walletAPI.redeemToProtoMart(redeemAmount);
      
      toast.success(`Successfully redeemed ₹${redeemAmount} to ProtoMart!`);
      
      if (onRedeemSuccess) {
        onRedeemSuccess();
      }
      
      setAmount('');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to redeem amount');
    } finally {
      setRedeeming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">Redeem to ProtoMart</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Current Balance: ₹{currentBalance.toFixed(2)}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to redeem"
              min="10"
              max={currentBalance}
              step="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum ₹10 • Maximum ₹{currentBalance.toFixed(2)}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 50, 100, currentBalance].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > currentBalance}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ₹{quickAmount === currentBalance ? 'All' : quickAmount}
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Redemption Info:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Amount will be credited to your ProtoMart account</li>
                  <li>You can use it to buy any product on ProtoMart.global</li>
                  <li>Processing time: Instant</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Redeem Button */}
          <button
            onClick={handleRedeem}
            disabled={redeeming || !amount || parseFloat(amount) < 10}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {redeeming ? 'Redeeming...' : `Redeem ₹${amount || '0'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;