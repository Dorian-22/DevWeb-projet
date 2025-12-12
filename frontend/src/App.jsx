// src/App.jsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminRoute } from './components/ProtectedRoute';
import EventsList from './views/events/EventsList.jsx';
import EventDetails from './views/events/EventDetails.jsx';
import AdminEventForm from './views/admin/AdminEventForm.jsx';
import Login from './views/auth/Login.jsx';
import Register from './views/auth/Register.jsx';

function App() {
  const { user, logout, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/events">Événements</Link>
          
          {isAdmin && (
            <Link to="/admin/events/new">Créer un événement</Link>
          )}
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontSize: '0.9rem' }}>Bonjour, {user.email}</span>
                {isAdmin && (
                  <span style={{
                    background: '#ffc107',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ADMIN
                  </span>
                )}
                <button
                  onClick={logout}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.9rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Connexion</Link>
                <Link to="/register">Inscription</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Routes auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes admin PROTÉGÉES */}
          <Route path="/admin/events/new" element={
            <AdminRoute>
              <AdminEventForm />
            </AdminRoute>
          } />
          <Route path="/admin/events/:id/edit" element={
            <AdminRoute>
              <AdminEventForm />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;