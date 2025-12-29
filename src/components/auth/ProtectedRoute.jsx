// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a glassmorphism loader

  if (!user) {
    // If no user is found, bounce them back to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;