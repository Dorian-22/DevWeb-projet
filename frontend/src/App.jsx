// src/App.jsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import EventsList from './views/events/EventsList.jsx';
import EventDetails from './views/events/EventDetails.jsx';
import AdminEventForm from './views/admin/AdminEventForm.jsx';

function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/events">Événements</Link>
          {/* plus tard: conditionner ce lien à role === ADMIN */}
          <Link to="/admin/events/new">Créer un événement</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Routes admin */}
          <Route path="/admin/events/new" element={<AdminEventForm />} />
          <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
