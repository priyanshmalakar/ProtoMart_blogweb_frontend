import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogsAPI } from "../api/blogs.api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { Edit, Trash2, PlusCircle } from "lucide-react";

const MyBlogsPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogsAPI.getMyBlogs();
      setBlogs(res.data);
    } catch {
      toast.error("Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await blogsAPI.deleteBlog(id);
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const handleEdit = (id) => {
    navigate(`/blogs/edit/${id}`); // ✅ BlogEditor open hoga
  };

  const handleCreate = () => {
    navigate("/blogs/write");
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Blogs</h1>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            Write Blog
          </button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            You haven’t written any blogs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow p-5"
              >
                {blog.coverImages?.[0] && (
                  <img
                    src={blog.coverImages[0]}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded-md mb-4"
                  />
                )}

                <h2 className="text-xl font-semibold mb-1">
                  {blog.title}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      blog.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {blog.status}
                  </span>
                </p>

                <p className="text-gray-600 line-clamp-2 mb-4">
                  {blog.content?.replace(/<[^>]*>/g, "").slice(0, 120)}...
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogsPage;
