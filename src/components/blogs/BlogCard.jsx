import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Eye, User } from 'lucide-react';
import { format } from 'date-fns';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blogs/${blog._id}`);
  };

  // Extract first 150 characters for preview
  const preview = blog.content
    ? blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : '';

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-blue-600">
          {blog.title}
        </h3>

        {/* Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {preview}
        </p>

        {/* Place */}
        {blog.placeId && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            <span className="truncate">
              {blog.placeId.name}
              {blog.placeId.city && `, ${blog.placeId.city}`}
            </span>
          </div>
        )}

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <div className="flex items-center">
            {blog.authorId?.profilePhoto ? (
              <img
                src={blog.authorId.profilePhoto}
                alt={blog.authorId.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400 mr-2" />
            )}
            <span>{blog.authorId?.name || 'Anonymous'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{blog.views || 0}</span>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{format(new Date(blog.publishedAt), 'MMM dd')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;