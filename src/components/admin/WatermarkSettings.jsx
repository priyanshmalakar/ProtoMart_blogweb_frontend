import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin.api';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const WatermarkSettings = () => {
  const [settings, setSettings] = useState({
    text: '',
    fontSize: 24,
    color: '#FFFFFF',
    position: { x: 50, y: 90 },
    opacity: 0.7
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWatermarkSettings();
      setSettings({
        text: response.data.text,
        fontSize: response.data.fontSize,
        color: response.data.color,
        position: response.data.position,
        opacity: response.data.opacity
      });
    } catch (error) {
      toast.error('Failed to load watermark settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminAPI.updateWatermarkSettings(settings);
      toast.success('Watermark settings updated successfully');
    } catch (error) {
      toast.error('Failed to update watermark settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Watermark Settings</h2>
        <button
          onClick={fetchSettings}
          className="text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Watermark Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Watermark Text</label>
          <input
            type="text"
            value={settings.text}
            onChange={(e) => setSettings({ ...settings, text: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="© BodyCureHealth Travel"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.fontSize}
            onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => setSettings({ ...settings, color: e.target.value })}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.color}
              onChange={(e) => setSettings({ ...settings, color: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Position (X: {settings.position.x}%, Y: {settings.position.y}%)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Horizontal (X)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.position.x}
                onChange={(e) => setSettings({
                  ...settings,
                  position: { ...settings.position, x: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Vertical (Y)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.position.y}
                onChange={(e) => setSettings({
                  ...settings,
                  position: { ...settings.position, y: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Opacity: {(settings.opacity * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.opacity}
            onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="bg-gray-100 rounded-lg p-8 relative h-64 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p className="text-sm mb-2">Sample Photo Background</p>
              <p className="text-xs">Watermark preview would appear here</p>
            </div>
            <div
              className="absolute"
              style={{
                left: `${settings.position.x}%`,
                top: `${settings.position.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${settings.fontSize}px`,
                color: settings.color,
                opacity: settings.opacity,
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {settings.text || 'Sample Text'}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default WatermarkSettings;