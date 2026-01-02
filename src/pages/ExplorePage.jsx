import React from 'react';
import PhotoMap from '../components/places/PhotoMap';

const ExplorePage = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold">Explore Travel Photos</h1>
      </header>

      {/* Full interactive map */}
      <div className="flex-1 relative">
        <PhotoMap />
      </div>
    </div>
  );
};

export default ExplorePage;
