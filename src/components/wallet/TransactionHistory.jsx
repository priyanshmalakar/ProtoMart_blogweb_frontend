import React, { useEffect, useState } from 'react';
import { walletAPI } from '../../api/wallet.api';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await walletAPI.getTransactions({ page, limit: 20 });
      
      if (page === 1) {
        setTransactions(response.data);
      } else {
        setTransactions(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.pagination.currentPage < response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'reward':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'redemption':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTransactionBgColor = (type) => {
    switch (type) {
      case 'reward':
        return 'bg-green-50';
      case 'redemption':
        return 'bg-red-50';
      case 'refund':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No transactions yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Upload photos to earn rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className={`${getTransactionBgColor(transaction.type)} rounded-lg p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${getTransactionBgColor(transaction.type)}`}>
                {getTransactionIcon(transaction.type)}
              </div>

              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.createdAt), 'PPp')}
                </p>

                {/* Photo Preview for Reward Transactions */}
                {transaction.photoId && (
                  <button
                    onClick={() => navigate(`/photos/${transaction.photoId._id}`)}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <ImageIcon className="w-3 h-3 mr-1" />
                    View Photo
                  </button>
                )}

                {/* ProtoMart Order ID */}
                {transaction.protomartOrderId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Order ID: {transaction.protomartOrderId}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side - Amount */}
            <div className="text-right">
              <p className={`text-xl font-bold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  transaction.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default TransactionHistory;