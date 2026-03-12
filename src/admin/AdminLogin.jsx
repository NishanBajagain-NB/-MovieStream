import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { adminAPI } from '../services/api';
import ConnectionTest from '../components/ConnectionTest';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await adminAPI.getProfile();
          if (response.data.success) {
            navigate('/admin/dashboard');
          }
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    console.log('Login attempt with:', { email: formData.email, password: '***' });

    try {
      const response = await adminAPI.login({
        email: formData.email.trim(),
        password: formData.password
      });
      
      console.log('Login response:', response);
      
      if (response.data.success) {
        // Store auth data
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
        
        // Clear form
        setFormData({ email: '', password: '' });
        
        console.log('Login successful, redirecting to dashboard');
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed. ';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure both backend and frontend are running.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message.includes('Backend server is not running')) {
        errorMessage = 'Backend server is not running. Please start the server with: npm run dev';
      } else {
        errorMessage += 'Please check your credentials and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-white">MovieStream</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to access the admin panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-light rounded-2xl p-8 border border-dark-lighter">
          {/* Connection Test */}
          <ConnectionTest />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Site */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to MovieStream
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;