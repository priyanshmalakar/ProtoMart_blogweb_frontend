import React from 'react';
import { Link2 } from 'lucide-react';

const AlbumLinkInput = ({ value, onChange, onValidate, validating }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Google Photos Album Link
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Link2 className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="https://photos.app.goo.gl/XXXXX"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onValidate}
          disabled={validating || !value.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {validating ? 'Checking...' : 'Validate'}
        </button>
      </div>
    </div>
  );
};

export default AlbumLinkInput;