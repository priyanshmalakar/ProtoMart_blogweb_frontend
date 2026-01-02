import React from 'react';
import BlogCard from './BlogCard';

const BlogList = ({ blogs, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-t-lg" />
            <div className="bg-gray-200 h-40 rounded-b-lg p-5">
              <div className="bg-gray-300 h-6 mb-3 rounded" />
              <div className="bg-gray-300 h-4 mb-2 rounded" />
              <div className="bg-gray-300 h-4 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blogs found</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to write about this place!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;