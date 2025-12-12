import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from "react";

import EventsList from './views/events/EventsList.jsx';
import EventDetails from './views/events/EventDetails.jsx';
import AdminEventForm from './views/admin/AdminEventForm.jsx';
import RegisterForm from "./views/registerForm";
import LoginForm from "./views/loginForm";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '12px' }}>

          {!user && (
            <>
              <LoginForm setUser={setUser} />
              <RegisterForm />
            </>
          )}

          {user && (
            <>
              <p>Connecté en tant que {user.name} ({user.role})</p>
              <Link to="/events">Événements</Link>

              {user.role === "ADMIN" && (
                <Link to="/admin/events/new">Créer un événement</Link>
              )}

              <button onClick={() => { setUser(null); localStorage.removeItem("token"); }}>
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>

          {/* Si pas de user -> redirection vers /login */}
          <Route
            path="/events"
            element={user ? <EventsList /> : <Navigate to="/" />}
          />

          <Route
            path="/events/:id"
            element={user ? <EventDetails /> : <Navigate to="/" />}
          />

          {/* Routes admin */}
          <Route
            path="/admin/events/new"
            element={
              user?.role === "ADMIN"
                ? <AdminEventForm />
                : <Navigate to="/events" />
            }
          />

          <Route
            path="/admin/events/:id/edit"
            element={
              user?.role === "ADMIN"
                ? <AdminEventForm />
                : <Navigate to="/events" />
            }
          />

          {/* Page par défaut */}
          <Route path="/" element={<Navigate to="/events" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
