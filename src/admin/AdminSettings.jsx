import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { adminAPI } from '../services/api';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await adminAPI.getProfile();
      const profile = response.data.data;
      setFormData({
        ...formData,
        email: profile.email
      });
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setSaving(true);
    
    try {
      const updateData = {
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await adminAPI.updateProfile(updateData);
      setSuccess(true);
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update admin settings');
      console.error('Error updating admin settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-light rounded w-1/3"></div>
          <div className="bg-dark-light rounded-lg p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
        <p className="text-gray-400 mt-1">Manage your admin account settings</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400">Admin settings updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="admin@moviestream.com"
              />
            </div>
          </div>
        </div>
        {/* Change Password */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Change Password
          </h2>
          
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">Password must be at least 6 characters long</p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-yellow-400 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-yellow-400 font-medium">Security Notice</h3>
              <p className="text-yellow-300 text-sm mt-1">
                Changing your password will log you out of all devices. Make sure to remember your new password.
              </p>
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
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;