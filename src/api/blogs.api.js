// import axiosInstance from './axios';

// export const blogsAPI = {
//   // Get all blogs
//   getBlogs: async (params) => {
//     return axiosInstance.get('/blogs', { params });
//   },

//   // Get blog by ID
//   getBlogById: async (id) => {
//     return axiosInstance.get(`/blogs/${id}`);
//   },

//   // Get blogs by place
//   getBlogsByPlace: async (placeId, params) => {
//     return axiosInstance.get(`/blogs/place/${placeId}`, { params });
//   },

//   // Create blog
//   // createBlog: async (data) => {
//   //   return axiosInstance.post('/blogs', data);
//   // },

//   // // Update blog
//   // updateBlog: async (id, data) => {
//   //   return axiosInstance.put(`/blogs/${id}`, data);
//   // },


// createBlog: (data) =>
//   axiosInstance.post('/blogs', data, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),

// updateBlog: (id, data) =>
//   axiosInstance.put(`/blogs/${id}`, data, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),


//   // Delete blog
//   deleteBlog: async (id) => {
//     return axiosInstance.delete(`/blogs/${id}`);
//   },

//   // Publish blog
//   publishBlog: async (id) => {
//     return axiosInstance.post(`/blogs/${id}/publish`);
//   },

//   // Get my blogs
//   getMyBlogs: async (params) => {
//     return axiosInstance.get('/blogs/my/blogs', { params });
//   }
// };



import axiosInstance from './axios';

export const blogsAPI = {
  getBlogs: (params) =>
    axiosInstance.get('/blogs', { params }),

  getBlogById: (id) =>
    axiosInstance.get(`/blogs/${id}`),

  getBlogsByPlace: (placeId, params) =>
    axiosInstance.get(`/blogs/place/${placeId}`, { params }),

  createBlog: (data) =>
    axiosInstance.post('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateBlog: (id, data) =>
    axiosInstance.put(`/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  deleteBlog: (id) =>
    axiosInstance.delete(`/blogs/${id}`),

  getMyBlogs: (params) =>
    axiosInstance.get('/blogs/my/blogs', { params }),
};
