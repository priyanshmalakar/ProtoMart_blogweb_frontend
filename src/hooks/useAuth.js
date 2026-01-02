import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth.api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { login: setAuth, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      queryClient.invalidateQueries(['user']);
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    }
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success('Registration successful!');
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    }
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getMe,
    enabled: !!useAuthStore.getState().token,
    retry: false
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    currentUser,
    isLoadingUser,
    isLoginLoading: loginMutation.isLoading,
    isRegisterLoading: registerMutation.isLoading
  };
};