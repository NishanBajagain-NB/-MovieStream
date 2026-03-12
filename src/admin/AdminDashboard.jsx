import { useState, useEffect } from 'react';
import { Film, Users, Eye, TrendingUp, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI, movieAPI, adsAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalViews: 0,
    activeAds: 0,
    recentMovies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats from API
      const [dashboardResponse, moviesResponse, adsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        movieAPI.getAllMovies({ limit: 5 }),
        adsAPI.getAll()
      ]);

      const dashboardData = dashboardResponse.data.data;
      const moviesData = moviesResponse.data.data;
      const adsData = adsResponse.data.data;

      setStats({
        totalMovies: dashboardData.total_movies || 0,
        totalViews: dashboardData.total_views || 0,
        activeAds: adsData.filter(ad => ad.enabled).length || 0,
        recentMovies: moviesData.slice(0, 5).map(movie => ({
          id: movie.id,
          name: movie.name,
          views: movie.views || 0,
          addedDate: movie.created_at
        }))
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      setStats({
        totalMovies: 6,
        totalViews: 2500,
        activeAds: 3,
        recentMovies: [
          { id: '1', name: 'The Dark Knight', views: 202, addedDate: '2026-03-12' },
          { id: '2', name: 'Inception', views: 1049, addedDate: '2026-03-12' },
          { id: '3', name: 'Interstellar', views: 108, addedDate: '2026-03-12' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {loading ? '...' : value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link to={link} className="text-primary hover:underline text-sm mt-2 inline-block">
          View Details →
        </Link>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin</p>
        </div>
        <Link
          to="/admin/add-movie"
          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Movie</span>
        </Link>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Film}
          title="Total Movies"
          value={stats.totalMovies}
          color="bg-blue-600"
          link="/admin/manage-movies"
        />
        <StatCard
          icon={Eye}
          title="Total Views"
          value={stats.totalViews}
          color="bg-green-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Ads"
          value={stats.activeAds}
          color="bg-purple-600"
          link="/admin/ads"
        />
        <StatCard
          icon={Users}
          title="Admin Users"
          value={1}
          color="bg-orange-600"
          link="/admin/admin-settings"
        />
      </div>

      {/* Recent Movies */}
      <div className="bg-dark-light rounded-lg border border-dark-lighter">
        <div className="p-6 border-b border-dark-lighter">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Movies</h2>
            <Link
              to="/admin/manage-movies"
              className="text-primary hover:underline text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-dark rounded skeleton"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-dark rounded skeleton w-1/3"></div>
                    <div className="h-3 bg-dark rounded skeleton w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentMovies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-4 bg-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-dark-lighter rounded flex items-center justify-center">
                      <Film className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{movie.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Added on {new Date(movie.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{movie.views.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/add-movie"
          className="bg-dark-light border border-dark-lighter rounded-lg p-6 hover:bg-dark-lighter transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary rounded-lg group-hover:bg-red-700 transition-colors">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Add New Movie</h3>
              <p className="text-gray-400 text-sm">Upload a new movie to the platform</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/ads"
          className="bg-dark-light border border-dark-lighter rounded-lg p-6 hover:bg-dark-lighter transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Manage Ads</h3>
              <p className="text-gray-400 text-sm">Configure advertisement settings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/site-settings"
          className="bg-dark-light border border-dark-lighter rounded-lg p-6 hover:bg-dark-lighter transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Site Settings</h3>
              <p className="text-gray-400 text-sm">Configure site preferences</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;