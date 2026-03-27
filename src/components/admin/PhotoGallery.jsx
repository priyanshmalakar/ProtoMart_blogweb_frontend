import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import adminAPI from "../../api/admin.api";

// ─── Watermark Hook ───────────────────────────────────────────────────────────
const useWatermark = () => {
  const [watermark, setWatermark] = useState(null);

  useEffect(() => {
    const fetchWatermark = async () => {
      try {
        const res = await adminAPI.getWatermarkSettings();
        if (res.success && res.data?.isActive) {
          setWatermark(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch watermark:", err);
      }
    };
    fetchWatermark();
  }, []);
  return watermark;
};

// ─── Watermark Overlay ────────────────────────────────────────────────────────
// Renders the watermark absolutely positioned over the image container.
// position.x and position.y are percentages (0–100) from the API.
const WatermarkOverlay = ({ watermark }) => {
  if (!watermark) return null;

  const { type, text, fontFamily, fontSize, color, opacity, position, watermarkImageUrl } = watermark;

  if (type === "image" && watermarkImageUrl) {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ overflow: "hidden" }}
      >
        <img
          src={watermarkImageUrl}
          alt="watermark"
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: opacity ?? 1,
            maxWidth: "20%",
            maxHeight: "20%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  if (type === "text" && text) {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ overflow: "hidden" }}
      >
        <span
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
            fontFamily: fontFamily || "Impact",
            fontSize: `${fontSize || 23}px`,
            color: color || "#ffffff",
            opacity: opacity ?? 1,
            whiteSpace: "nowrap",
            userSelect: "none",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  return null;
};

// ─── PhotoLightbox ────────────────────────────────────────────────────────────
const PhotoLightbox = ({ photos, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const watermark = useWatermark();
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const navbar = document.querySelector("nav");
    if (navbar) navbar.style.display = "none";

    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          await document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } catch (err) {
        console.error("Error entering fullscreen:", err);
      }
    };
    enterFullscreen();

    return () => {
      document.body.style.overflow = "auto";
      if (navbar) navbar.style.display = "block";
      if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "Escape") onClose();
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, zoom]);

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoom();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoom();
    }
  };

const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 8));
const handleZoomOut = () => {
  setZoom((prev) => Math.max(prev - 0.5, 0.5));
  if (zoom <= 1) resetPosition();
};

  const resetZoom = () => {
    setZoom(1);
    resetPosition();
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
        <div className="flex justify-between items-center">
          <div className="text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
           disabled={zoom <= 1}
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <button
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        {/* ── Image + Watermark wrapper: transforms together as one unit ── */}
        <div
          className="relative max-w-full max-h-full"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
            transition: isDragging ? "none" : "transform 0.2s ease",
            transformOrigin: "center center",
            display: "inline-flex",
          }}
        >
          <img
            src={currentPhoto.originalUrl || currentPhoto.url}
            alt={currentPhoto.title || "Photo"}
            className="max-w-full max-h-full object-contain select-none block"
            style={{ maxHeight: "100vh", maxWidth: "100vw" }}
            draggable={false}
          />

          {/* ── Watermark sits ON the image, moves & scales with it ── */}
          <WatermarkOverlay watermark={watermark} />
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Photo Info Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-10">
        <div className="max-w-4xl mx-auto text-white">
          {currentPhoto.title && (
            <h3 className="text-xl font-semibold mb-2">{currentPhoto.title}</h3>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {currentPhoto.place && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {currentPhoto.place.name}
                  {currentPhoto.place.city && `, ${currentPhoto.place.city}`}
                  {currentPhoto.place.state && `, ${currentPhoto.place.state}`}
                  {currentPhoto.place.country &&
                    `, ${currentPhoto.place.country}`}
                </span>
              </div>
            )}
            {currentPhoto.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(currentPhoto.date).toLocaleDateString()}</span>
              </div>
            )}
            {currentPhoto.photographer && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{currentPhoto.photographer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PhotoGallery ─────────────────────────────────────────────────────────────
const PhotoGallery = ({ photos, tileSize = "medium" }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [currentTileSize, setCurrentTileSize] = useState(tileSize);

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  const gridClasses = {
    small:
      "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
    medium:
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    large: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div>
      {/* Size Controls */}
      <div className="flex justify-end gap-2 mb-4">
        {["small", "medium", "large"].map((size) => (
          <button
            key={size}
            onClick={() => setCurrentTileSize(size)}
            className={`px-3 py-1 rounded capitalize ${
              currentTileSize === size
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className={`grid ${gridClasses[currentTileSize]} gap-4`}>
        {photos.map((photo, index) => (
          <div
            key={photo._id || index}
            className={`${sizeClasses[currentTileSize]} cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group relative`}
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <img
              src={photo.originalUrl || photo.url}
              alt={photo.title || "Photo"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
};

export { PhotoGallery, PhotoLightbox };
