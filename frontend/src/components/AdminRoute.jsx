// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // optionnel : si AuthProvider a un loading
  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default AdminRoute;
