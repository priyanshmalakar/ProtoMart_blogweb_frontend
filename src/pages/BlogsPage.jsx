// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { blogsAPI } from '../api/blogs.api';
// import BlogList from '../components/blogs/BlogList';
// import { PlusCircle, Search, Filter } from 'lucide-react';
// import useAuthStore from '../store/authStore';
// import toast from 'react-hot-toast';

// const BlogsPage = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchBlogs();
//   }, [page, searchQuery]);

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page,
//         limit: 12,
//         status: 'published',
//         ...(searchQuery && { search: searchQuery })
//       };

//       const response = await blogsAPI.getBlogs(params);

//       if (page === 1) {
//         setBlogs(response.data);
//       } else {
//         setBlogs(prev => [...prev, ...response.data]);
//       }

//       setHasMore(response.pagination.currentPage < response.pagination.totalPages);
//     } catch (error) {
//       toast.error('Failed to load blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchBlogs();
//   };

//   const handleWriteBlog = () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to write a blog');
//       navigate('/login');
//       return;
//     }
//     navigate('/blogs/write');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Travel Blogs</h1>
//             <p className="text-gray-600 mt-1">Read stories from travelers around the world</p>
//           </div>

//           <button
//             onClick={handleWriteBlog}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//           >
//             <PlusCircle className="w-5 h-5" />
//             <span>Write Blog</span>
//           </button>
//         </div>

//         {/* Search & Filters */}
//         <div className="bg-white rounded-lg shadow-md p-4 mb-8">
//           <form onSubmit={handleSearch} className="flex items-center space-x-4">
//             <div className="flex-1 relative">
//               <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search blogs..."
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
//             >
//               <Filter className="w-5 h-5" />
//               <span>Filters</span>
//             </button>
//           </form>
//         </div>

//         {/* Blogs Grid */}
//         <BlogList blogs={blogs} loading={loading && page === 1} />

//         {/* Load More */}
//         {hasMore && (
//           <div className="text-center mt-8">
//             <button
//               onClick={() => setPage(prev => prev + 1)}
//               disabled={loading}
//               className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Loading...' : 'Load More'}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogsPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogsAPI } from "../api/blogs.api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import BlogCard from "../components/blogs/BlogCard";
import { PlusCircle } from "lucide-react";

const BlogsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user); // Logged-in user
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Fetch all published blogs
      const res = await blogsAPI.getBlogs({ status: "published" });
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    navigate("/blogs/write");
  };

  // Filter blogs by search query
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.placeId?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title or place"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isAuthenticated && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Write Blog
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
