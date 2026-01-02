import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletAPI } from '../api/wallet.api';
import toast from 'react-hot-toast';

export const useWallet = () => {
  const queryClient = useQueryClient();

  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['walletBalance'],
    queryFn: walletAPI.getBalance
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletAPI.getTransactions({ page: 1, limit: 20 })
  });

  const redeemMutation = useMutation({
    mutationFn: walletAPI.redeemToProtoMart,
    onSuccess: () => {
      queryClient.invalidateQueries(['walletBalance']);
      queryClient.invalidateQueries(['transactions']);
      toast.success('Amount redeemed successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to redeem amount');
    }
  });

  return {
    balance: balance?.data?.balance || 0,
    transactions: transactions?.data || [],
    isLoadingBalance,
    isLoadingTransactions,
    redeemToProtoMart: redeemMutation.mutate,
    isRedeeming: redeemMutation.isLoading
  };
};