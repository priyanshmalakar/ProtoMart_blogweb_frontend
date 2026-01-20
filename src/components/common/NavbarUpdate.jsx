import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  Menu,
  X,
  User,
  Wallet,
  Upload,
  LogOut,
  Settings,
  Image,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

   const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  // ✅ Upload button handler
  const handleUploadClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/upload");
    }
  };

  const handleBlogsClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/blogs");
    }
  };

  return (
      <nav className=" absolute top-0 left-0 right-0 shadow-md z-[9999]" style={isHomePage ? {background: 'transparent'} : {background: '#00a6ff'}}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              Travel Photos.com
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 text-sm font-bold text-black hover:text-gray-800" >
            <Link to="/file-explorer" >
              Explore Photos
            </Link>
            <span className="">|</span>
            <Link to="/map">
              Explore by map
            </Link>
            <span className="">|</span>
            <button
              onClick={handleUploadClick}
            
            >
              Upload Photos
            </button>
            <span className="">|</span>
            <button
              onClick={handleBlogsClick}
             
            >
              Write blog
            </button>
            <span className="text-white">|</span>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                
                >
                  My Account
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/my-photos"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Image className="w-4 h-4" />
                        <span>My Photos</span>
                      </Link>
                      <Link
                        to="/wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Wallet</span>
                      </Link>
                      {(user?.role === "admin" ||
                        user?.role === "superadmin") && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin</span>
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-gray-200">
                My Account!
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3 text-white">
              <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>
                Explore Photos
              </Link>
              <Link to="/map" onClick={() => setMobileMenuOpen(false)}>
                Explore by map
              </Link>
              <button
                onClick={() => {
                  handleUploadClick();
                  setMobileMenuOpen(false);
                }}
                className="text-left"
              >
                Upload Photos
              </button>
              <button
                onClick={() => {
                  handleBlogsClick();
                  setMobileMenuOpen(false);
                }}
                className="text-left"
              >
                Write blog
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link
                    to="/my-photos"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Photos
                  </Link>
                  <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
                    Wallet
                  </Link>
                  {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  My Account!
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
