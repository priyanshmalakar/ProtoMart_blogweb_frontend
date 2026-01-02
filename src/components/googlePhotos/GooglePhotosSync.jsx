import React, { useState } from 'react';
import { googlePhotosAPI } from '../../api/googlePhotos.api';
import { Link2, CheckCircle, XCircle, Loader, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const GooglePhotosSync = () => {
  const [shareLink, setShareLink] = useState('');
  const [validating, setValidating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [validated, setValidated] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [syncResult, setSyncResult] = useState(null);

  const handleValidate = async () => {
    if (!shareLink.trim()) {
      toast.error('Please enter album link');
      return;
    }

    try {
      setValidating(true);
      const response = await googlePhotosAPI.validateLink(shareLink);
      
      setValidated(true);
      setAlbumTitle(response.data.title);
      toast.success('Album link is valid!');
    } catch (error) {
      toast.error(error.message || 'Invalid album link. Make sure it\'s publicly shared.');
      setValidated(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSync = async () => {
    if (!validated) {
      toast.error('Please validate the link first');
      return;
    }

    try {
      setSyncing(true);
      setSyncResult(null);
      
      const response = await googlePhotosAPI.syncPhotos(shareLink);
      
      setSyncResult(response.data);
      toast.success(`Successfully synced ${response.data.uploaded} photos!`);
      
      // Reset form
      setShareLink('');
      setValidated(false);
      setAlbumTitle('');
    } catch (error) {
      toast.error(error.message || 'Failed to sync photos');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Sync from Google Photos</h2>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to sync:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Open Google Photos and create/select an album</li>
          <li>Click the Share button (⚙️)</li>
          <li>Enable "Create link" or "Get link"</li>
          <li>Make sure sharing is set to "Anyone with the link"</li>
          <li>Copy the link and paste it below</li>
        </ol>
      </div>

      {/* Link Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Album Share Link
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={shareLink}
            onChange={(e) => {
              setShareLink(e.target.value);
              setValidated(false);
            }}
            placeholder="https://photos.app.goo.gl/XXXXX"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleValidate}
            disabled={validating || !shareLink.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {validating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>Validate</span>
          </button>
        </div>

        {/* Validation Status */}
        {validated && albumTitle && (
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Valid album: {albumTitle}</span>
          </div>
        )}
      </div>

      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={!validated || syncing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {syncing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Syncing photos...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Sync Photos</span>
          </>
        )}
      </button>

      {/* Sync Progress/Result */}
      {syncing && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Please wait... This may take a few minutes depending on album size.
          </p>
        </div>
      )}

      {syncResult && (
        <div className="mt-6 bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Sync Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Photos:</span>
              <span className="font-medium">{syncResult.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Successfully Uploaded:</span>
              <span className="font-medium text-green-600">{syncResult.uploaded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skipped (Already Synced):</span>
              <span className="font-medium text-yellow-600">{syncResult.skipped}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failed:</span>
              <span className="font-medium text-red-600">{syncResult.failed}</span>
            </div>
          </div>

          {syncResult.errors && syncResult.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded">
              <p className="text-xs text-red-700 font-medium mb-1">Errors:</p>
              {syncResult.errors.slice(0, 3).map((error, i) => (
                <p key={i} className="text-xs text-red-600">{error.error}</p>
              ))}
              {syncResult.errors.length > 3 && (
                <p className="text-xs text-red-600">
                  ... and {syncResult.errors.length - 3} more
                </p>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-xs text-blue-800">
              ✅ Photos are pending admin approval. You'll earn rewards once approved!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GooglePhotosSync;