// src/App.jsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import EventsList from './views/events/EventsList.jsx';
import EventDetails from './views/events/EventDetails.jsx';

function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/events">Événements</Link>
          {/* Plus tard : lien admin, login, etc. */}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          {/* plus tard : routes /admin/... */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
