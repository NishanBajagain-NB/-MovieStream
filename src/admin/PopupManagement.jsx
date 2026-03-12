import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { popupAPI } from '../services/api';

const PopupManagement = () => {
  const [formData, setFormData] = useState({
    enabled: true,
    title: '',
    description: '',
    discord_link: '',
    facebook_link: '',
    twitter_link: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPopupSettings();
  }, []);

  const fetchPopupSettings = async () => {
    try {
      const response = await popupAPI.getPopupSettings();
      const settings = response.data.data;
      setFormData({
        enabled: settings.enabled,
        title: settings.title || '',
        description: settings.description || '',
        discord_link: settings.discord_link || '',
        facebook_link: settings.facebook_link || '',
        twitter_link: settings.twitter_link || ''
      });
    } catch (error) {
      console.error('Error fetching popup settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await popupAPI.updatePopupSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving popup settings:', error);
      alert('Error saving popup settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-light rounded w-1/3"></div>
          <div className="bg-dark-light rounded-lg p-6 space-y-4">
            <div className="h-4 bg-dark rounded w-1/4"></div>
            <div className="h-10 bg-dark rounded"></div>
            <div className="h-4 bg-dark rounded w-1/4"></div>
            <div className="h-20 bg-dark rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Popup Management</h1>
        <p className="text-gray-400 mt-1">Configure the startup popup modal settings</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400">Popup settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
          
          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Enable Startup Popup</label>
                <p className="text-gray-400 text-sm">Show popup when users first visit the site</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, enabled: !formData.enabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.enabled ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {formData.enabled ? (
                  <Eye className="w-5 h-5 text-green-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Popup Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Enter popup title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Enter popup description"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discord */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord Invite Link
              </label>
              <input
                type="url"
                name="discord_link"
                value={formData.discord_link}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="https://discord.gg/your-server"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebook_link"
                value={formData.facebook_link}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="https://facebook.com/your-page"
              />
            </div>

            {/* Twitter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitter Profile URL
              </label>
              <input
                type="url"
                name="twitter_link"
                value={formData.twitter_link}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="https://twitter.com/your-profile"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          
          <div className="bg-dark rounded-lg p-6 border border-dark-lighter max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {formData.title || 'Popup Title'}
              </h3>
              
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                {formData.description || 'Popup description will appear here...'}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-white font-medium">Follow Us</h4>
                <div className="flex justify-center space-x-2">
                  {formData.discord_link && (
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded text-xs">Discord</div>
                  )}
                  {formData.facebook_link && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Facebook</div>
                  )}
                  {formData.twitter_link && (
                    <div className="bg-sky-500 text-white px-3 py-1 rounded text-xs">Twitter</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupManagement;