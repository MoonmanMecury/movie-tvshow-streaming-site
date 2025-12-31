import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import MyListPage from './pages/MyListPage';
import PlayerPage from './pages/PlayerPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage'; 
import VerifySuccess from './pages/VerifySuccess';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  const location = useLocation(); // Hook to track route changes for animation

  return (
    <AuthProvider>
      {/* mode="wait" ensures the exit animation finishes before the new page enters */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage initialMode="login" />} />
          <Route path="/signup" element={<LoginPage initialMode="signup" />} /> 
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          
          
          {/* Protected Routes */}
          <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
          <Route path="/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/watch/:type/:id" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;