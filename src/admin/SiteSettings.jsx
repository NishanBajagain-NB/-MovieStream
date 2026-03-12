import { useState, useEffect } from 'react';
import { Save, Upload, Image } from 'lucide-react';
import { siteAPI } from '../services/api';

const SiteSettings = () => {
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    site_logo: '',
    favicon: '',
    primary_color: '#e50914',
    footer_text: '',
    contact_email: '',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await siteAPI.getSettings();
      const settings = response.data.data;
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        site_logo: settings.site_logo || '',
        favicon: settings.favicon || '',
        primary_color: settings.primary_color || '#e50914',
        footer_text: settings.footer_text || '',
        contact_email: settings.contact_email || '',
        maintenance_mode: settings.maintenance_mode || false
      });
    } catch (error) {
      console.error('Error fetching site settings:', error);
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
      // Validate required fields
      if (!formData.site_name?.trim()) {
        throw new Error('Site name is required');
      }
      
      // Clean and prepare data
      const cleanData = {
        site_name: formData.site_name.trim(),
        site_description: formData.site_description?.trim() || '',
        site_logo: formData.site_logo?.trim() || '',
        favicon: formData.favicon?.trim() || '',
        primary_color: formData.primary_color || '#e50914',
        footer_text: formData.footer_text?.trim() || '',
        contact_email: formData.contact_email?.trim() || '',
        maintenance_mode: Boolean(formData.maintenance_mode)
      };

      console.log('Updating site settings with:', cleanData);

      const response = await siteAPI.updateSettings(cleanData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving site settings:', error);
      
      let errorMessage = 'Error saving site settings: ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
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
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-dark rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-dark rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="text-gray-400 mt-1">Configure your website's general settings</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400">Site settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="MovieStream"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="contact@moviestream.com"
              />
            </div>

            {/* Site Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                name="site_description"
                value={formData.site_description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Your ultimate destination for free movie streaming"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Branding</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Logo URL
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  name="site_logo"
                  value={formData.site_logo}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/logo.png"
                />
                {formData.site_logo && (
                  <div className="flex items-center space-x-2 p-2 bg-dark rounded">
                    <Image className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Logo Preview</span>
                  </div>
                )}
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                name="favicon"
                value={formData.favicon}
                onChange={handleChange}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="w-12 h-10 bg-dark border border-dark-lighter rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                  className="flex-1 bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="#e50914"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Footer Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              name="footer_text"
              value={formData.footer_text}
              onChange={handleChange}
              className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              placeholder="© 2024 MovieStream. All rights reserved."
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Maintenance Mode</label>
              <p className="text-gray-400 text-sm">Enable to show maintenance page to visitors</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({...formData, maintenance_mode: !formData.maintenance_mode})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.maintenance_mode ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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

export default SiteSettings;