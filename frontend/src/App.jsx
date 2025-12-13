import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.jsx';

import EventsList from './views/events/EventsList.jsx';
import EventDetails from './views/events/EventDetails.jsx';
import AdminEventForm from './views/admin/AdminEventForm.jsx';

import MyRegistrations from './views/registrations/MyRegistrations.jsx';
import AdminEventRegistrations from './views/admin/AdminEventRegistrations.jsx';

import Login from './views/auth/Login.jsx';
import Register from './views/auth/Register.jsx';


function App() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/events">Événements</Link>

          {isAuthenticated && (
            <>
              <Link to="/me/registrations">Mes inscriptions</Link>

              {user?.role === 'ADMIN' && ( 
                <Link to="/admin/events/new">Créer un événement</Link>
                
              )}
              <span style={{ fontSize: '0.9rem' }}>Bonjour, {user.email}</span>

              <button type="button" onClick={logout}>
                Déconnexion
              </button>
            </>

          )}

          
          {!isAuthenticated && (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
            
            </>
          )}

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
          

        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route
            path="/me/registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events/new"
            element={
              <AdminRoute>
                <AdminEventForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/:id/edit"
            element={
              <AdminRoute>
                <AdminEventForm />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/events/:id/registrations"
            element={
              <AdminRoute>
                <AdminEventRegistrations />
              </AdminRoute>
            }
          />

          <Route path="*" element={<p>Page introuvable</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
