import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// User Pages
import HomePage from './pages/HomePage';
import MoviePlayerPage from './pages/MoviePlayerPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AddMovie from './admin/AddMovie';
import ManageMovies from './admin/ManageMovies';
import AdsManagement from './admin/AdsManagement';
import PopupManagement from './admin/PopupManagement';
import SiteSettings from './admin/SiteSettings';
import AdminSettings from './admin/AdminSettings';

// Components
import StartupPopup from './components/StartupPopup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup on first load
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark text-white">
        {showPopup && <StartupPopup onClose={handleClosePopup} />}
        
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePlayerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/add-movie" element={
            <ProtectedRoute>
              <AdminLayout>
                <AddMovie />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-movies" element={
            <ProtectedRoute>
              <AdminLayout>
                <ManageMovies />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/ads" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdsManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/popup" element={
            <ProtectedRoute>
              <AdminLayout>
                <PopupManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/site-settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <SiteSettings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/admin-settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* 404 Not Found - Must be last route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;