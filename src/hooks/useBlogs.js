import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsAPI } from '../api/blogs.api';
import toast from 'react-hot-toast';

export const useBlogs = (params = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogsAPI.getBlogs(params)
  });

  return {
    blogs: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
};

export const useBlogById = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsAPI.getBlogById(id),
    enabled: !!id
  });

  return {
    blog: data?.data,
    isLoading,
    error
  };
};

export const useMyBlogs = (params = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['myBlogs', params],
    queryFn: () => blogsAPI.getMyBlogs(params)
  });

  return {
    blogs: data?.data || [],
    pagination: data?.pagination,
    isLoading
  };
};

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: blogsAPI.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['myBlogs']);
      toast.success('Blog created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create blog');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogsAPI.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['myBlogs']);
      toast.success('Blog updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update blog');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: blogsAPI.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['myBlogs']);
      toast.success('Blog deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog');
    }
  });

  const publishMutation = useMutation({
    mutationFn: blogsAPI.publishBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['myBlogs']);
      toast.success('Blog published successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to publish blog');
    }
  });

  return {
    createBlog: createMutation.mutate,
    updateBlog: updateMutation.mutate,
    deleteBlog: deleteMutation.mutate,
    publishBlog: publishMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isPublishing: publishMutation.isLoading
  };
};