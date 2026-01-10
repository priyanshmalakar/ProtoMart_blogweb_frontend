
// import React, { useState, useRef } from 'react';
// import { Upload, X } from 'lucide-react';
// import { photosAPI } from '../../api/photos.api';
// import toast from 'react-hot-toast';

// const PhotoUpload = ({ onUploadSuccess }) => {
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (!selectedFiles.length) return;

//     const validFiles = [];
//     const previewList = [];

//     selectedFiles.forEach((file) => {
//       const isValid =
//         file.type.startsWith('image/') ||
//         file.type.startsWith('video/');

//       if (!isValid) {
//         toast.error(`Invalid file: ${file.name}`);
//         return;
//       }

//       if (file.size > 50 * 1024 * 1024) {
//         toast.error(`File too large (50MB max): ${file.name}`);
//         return;
//       }

//       validFiles.push(file);
//       previewList.push({
//         url: URL.createObjectURL(file),
//         type: file.type,
//       });
//     });

//     setFiles(validFiles);
//     setPreviews(previewList);
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleUpload = async () => {
//     if (!files.length) {
//       toast.error('Please select photos or videos');
//       return;
//     }

//     try {
//       setUploading(true);
//       const formData = new FormData();

//       files.forEach((file) => {
//         formData.append('photo', file); // ⚠️ backend expects "photo"
//       });

//       const res = await photosAPI.uploadPhoto(formData);

//       toast.success(`Uploaded ${res.data.count} files successfully`);
//       setFiles([]);
//       setPreviews([]);
//       fileInputRef.current.value = '';

//       onUploadSuccess?.(res.data.data);
//     } catch (err) {
//       toast.error(err.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Upload Photos / Videos</h2>

//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         accept="image/*,video/*"
//         onChange={handleFileSelect}
//         className="hidden"
//         id="upload-input"
//       />

//       <label
//         htmlFor="upload-input"
//         className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
//       >
//         <Upload className="w-10 h-10 text-gray-400 mb-2" />
//         <p className="text-sm text-gray-600">Click to select images or videos</p>
//         <p className="text-xs text-gray-400">Max 50MB per file</p>
//       </label>

//       {/* PREVIEW */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//         {previews.map((item, index) => (
//           <div key={index} className="relative">
//             {item.type.startsWith('image') ? (
//               <img
//                 src={item.url}
//                 alt="preview"
//                 className="h-40 w-full object-cover rounded"
//               />
//             ) : (
//               <video
//                 src={item.url}
//                 controls
//                 className="h-40 w-full object-cover rounded"
//               />
//             )}

//             <button
//               onClick={() => removeFile(index)}
//               className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
//       >
//         {uploading ? 'Uploading...' : 'Upload Files'}
//       </button>
//     </div>
//   );
// };

// export default PhotoUpload;




import React, { useEffect, useRef, useState } from 'react';
import { Upload, X, MapPin } from 'lucide-react';
import { photosAPI } from '../../api/photos.api';
import { placesAPI } from '../../api/places.api';
import toast from 'react-hot-toast';
import axios from 'axios';

const PhotoUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [newPlaceName, setNewPlaceName] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const fileInputRef = useRef(null);

  // 🔹 Load existing places
  useEffect(() => {
    placesAPI.getAllPlaces({ limit: 1000 }).then(res => {
      setPlaces(res.data || []);
    });
  }, []);

  // 🔹 File select
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(
      selected.map(f => ({
        url: URL.createObjectURL(f),
        type: f.type
      }))
    );
  };

  // 🔹 Existing place selected
  const handlePlaceSelect = (placeId) => {
    setSelectedPlaceId(placeId);
    setNewPlaceName('');

    const place = places.find(p => p._id === placeId);
    if (place?.location?.coordinates) {
      setCoordinates({
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0]
      });
    }
  };

  // 🔹 New place → geocode
  const geocodePlace = async () => {
    if (!newPlaceName) return;

    try {
      const res = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: newPlaceName,
            format: 'json',
            limit: 1
          }
        }
      );

      if (!res.data.length) {
        toast.error('Place not found');
        return;
      }

      setCoordinates({
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon)
      });

      toast.success('Location detected');
    } catch {
      toast.error('Failed to detect location');
    }
  };

  // 🔹 Upload
  const handleUpload = async () => {
    if (!files.length) return toast.error('Select files');
    if (!coordinates) return toast.error('Select or add a place');

    try {
      setUploading(true);
      const formData = new FormData();

      files.forEach(file => {
        formData.append('photo', file);
      });

      formData.append('latitude', coordinates.latitude);
      formData.append('longitude', coordinates.longitude);

      const res = await photosAPI.uploadPhoto(formData);
      toast.success('Upload successful');

      setFiles([]);
      setPreviews([]);
      setSelectedPlaceId('');
      setNewPlaceName('');
      setCoordinates(null);
      fileInputRef.current.value = '';

      onUploadSuccess?.(res.data.data);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Photos / Videos</h2>

      {/* PLACE SELECT */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Select Existing Place
        </label>
        <select
          value={selectedPlaceId}
          onChange={(e) => handlePlaceSelect(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select place --</option>
          {places.map(place => (
            <option key={place._id} value={place._id}>
              {place.name}, {place.city}
            </option>
          ))}
        </select>
      </div>

      {/* NEW PLACE */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Or Add New Place
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlaceName}
            onChange={(e) => {
              setNewPlaceName(e.target.value);
              setSelectedPlaceId('');
            }}
            placeholder="Enter place name"
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={geocodePlace}
            className="bg-blue-600 text-white px-4 rounded"
          >
            <MapPin size={18} />
          </button>
        </div>
      </div>

      {/* COORDINATES */}
      {coordinates && (
        <p className="text-sm text-gray-600 mb-4">
          📍 Lat: {coordinates.latitude.toFixed(5)}, Lng:{' '}
          {coordinates.longitude.toFixed(5)}
        </p>
      )}

      {/* FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="upload-input"
      />

      <label
        htmlFor="upload-input"
        className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p>Select images or videos</p>
      </label>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {previews.map((p, i) => (
          <div key={i} className="relative">
            {p.type.startsWith('image') ? (
              <img src={p.url} className="h-32 w-full object-cover rounded" />
            ) : (
              <video src={p.url} controls className="h-32 w-full rounded" />
            )}
            <button
              onClick={() => {
                setFiles(f => f.filter((_, idx) => idx !== i));
                setPreviews(pv => pv.filter((_, idx) => idx !== i));
              }}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default PhotoUpload;
