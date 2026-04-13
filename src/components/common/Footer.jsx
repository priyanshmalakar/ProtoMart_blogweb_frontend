import { Camera, Mail, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpeg'
const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* <Camera className="w-6 h-6" />
              <span className="text-xl font-bold">TravelPhotos</span> */}
<img src={logo} alt="Travel Photos.com" className="h-12 w-14" />
            </div>
            <p className="text-gray-400">
              Share your travel moments and discover amazing places around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigate('/file-explorer')}
                  className="hover:text-white transition"
                >
                  Explore Photos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/map')}
                  className="hover:text-white transition"
                >
                  Explore Photos by Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/upload')}
                  className="hover:text-white transition"
                >
                  Upload Photos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blogs')}
                  className="hover:text-white transition"
                >
                  Write Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@travelphotos.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Indore, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TravelPhotos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer