import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { adsAPI } from '../services/api';

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    ad_code: '',
    redirect_link: '',
    position: 'top',
    enabled: true,
    adType: 'image' // 'image' or 'code'
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await adsAPI.getAll();
      setAds(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adData = {
        name: formData.name,
        image_url: formData.adType === 'image' ? formData.image_url : null,
        ad_code: formData.adType === 'code' ? formData.ad_code : null,
        redirect_link: formData.adType === 'image' ? formData.redirect_link : null,
        position: formData.position,
        enabled: formData.enabled
      };

      if (editingAd) {
        await adsAPI.updateAd(editingAd.id, adData);
      } else {
        await adsAPI.createAd(adData);
      }
      
      await fetchAds(); // Refresh the list
      setShowForm(false);
      setEditingAd(null);
      setFormData({
        name: '',
        image_url: '',
        ad_code: '',
        redirect_link: '',
        position: 'top',
        enabled: true,
        adType: 'image'
      });
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Error saving ad: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      image_url: ad.image_url || '',
      ad_code: ad.ad_code || '',
      redirect_link: ad.redirect_link || '',
      position: ad.position,
      enabled: ad.enabled,
      adType: ad.ad_code ? 'code' : 'image'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await adsAPI.deleteAd(id);
        setAds(ads.filter(ad => ad.id !== id));
      } catch (error) {
        console.error('Error deleting ad:', error);
        alert('Error deleting ad');
      }
    }
  };

  const toggleEnabled = async (id) => {
    try {
      const ad = ads.find(a => a.id === id);
      const updatedAd = { 
        name: ad.name,
        image_url: ad.image_url,
        ad_code: ad.ad_code,
        redirect_link: ad.redirect_link,
        position: ad.position,
        enabled: !ad.enabled 
      };
      await adsAPI.updateAd(id, updatedAd);
      setAds(ads.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    } catch (error) {
      console.error('Error toggling ad:', error);
      alert('Error updating ad status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Ads Management</h1>
          <p className="text-gray-400 mt-1">Manage advertisement banners and Adstera code ads ({ads.length} ads)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Ad</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-light rounded-lg p-6 w-full max-w-md border border-dark-lighter max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingAd ? 'Edit Ad' : 'Add New Ad'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Type</label>
                <select
                  value={formData.adType}
                  onChange={(e) => setFormData({...formData, adType: e.target.value})}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                >
                  <option value="image">Image Banner</option>
                  <option value="code">Code Ad (Adstera/Custom)</option>
                </select>
              </div>

              {formData.adType === 'image' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      required={formData.adType === 'image'}
                      className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Redirect Link</label>
                    <input
                      type="url"
                      value={formData.redirect_link}
                      onChange={(e) => setFormData({...formData, redirect_link: e.target.value})}
                      required={formData.adType === 'image'}
                      className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Code (Adstera/Custom HTML/JS)
                  </label>
                  <textarea
                    value={formData.ad_code}
                    onChange={(e) => setFormData({...formData, ad_code: e.target.value})}
                    required={formData.adType === 'code'}
                    rows={6}
                    placeholder="Paste your Adstera ad code or custom HTML/JavaScript here..."
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white font-mono text-sm"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    For Adstera: Copy the complete script tag from your Adstera dashboard
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                >
                  <option value="top">Top Banner</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="bottom">Bottom Banner</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-gray-300">Enabled</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAd(null);
                    setFormData({
                      name: '',
                      image_url: '',
                      ad_code: '',
                      redirect_link: '',
                      position: 'top',
                      enabled: true,
                      adType: 'image'
                    });
                  }}
                  className="px-4 py-2 text-gray-300 border border-dark-lighter rounded-lg hover:bg-dark-lighter"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  {editingAd ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="bg-dark-light rounded-lg border border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark border-b border-dark-lighter">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Ad</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Type</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Position</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Performance</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="border-b border-dark-lighter">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-12 bg-dark rounded skeleton"></div>
                        <div className="h-4 bg-dark rounded skeleton w-32"></div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-20"></div></td>
                  </tr>
                ))
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg mb-2">No ads found</p>
                      <p className="text-sm">Start by adding your first advertisement</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="border-b border-dark-lighter hover:bg-dark/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {ad.image_url ? (
                          <img
                            src={ad.image_url}
                            alt={ad.name}
                            className="w-16 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x100/333/fff?text=Ad';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-12 bg-dark-lighter rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">CODE</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-white font-medium">{ad.name}</h3>
                          <p className="text-gray-400 text-sm">ID: {ad.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        ad.ad_code ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {ad.ad_code ? 'Code Ad' : 'Image'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-gray-300">{ad.position}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        ad.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {ad.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      <div className="text-sm">
                        <div>{ad.clicks || 0} clicks</div>
                        <div>{ad.impressions || 0} views</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleEnabled(ad.id)}
                          className={`p-1 ${ad.enabled ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'}`}
                          title={ad.enabled ? 'Disable Ad' : 'Enable Ad'}
                        >
                          {ad.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(ad)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Edit Ad"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Ad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;