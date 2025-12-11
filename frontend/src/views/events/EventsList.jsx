// src/views/events/EventsList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../../services/event-service';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <p>Chargement des événements...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Erreur : {error}</p>;
  }

  if (!events.length) {
    return <p>Aucun événement disponible pour le moment.</p>;
  }

  return (
    <div>
      <h1>Liste des événements</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event) => (
          <li
            key={event.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <h2 style={{ margin: '0 0 8px' }}>
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </h2>
            {event.category && (
              <p style={{ margin: '0 0 4px', fontStyle: 'italic' }}>
                Catégorie : {event.category.name}
              </p>
            )}
            {event.location && (
              <p style={{ margin: '0 0 4px' }}>
                Lieu : {event.location.name} ({event.location.city})
              </p>
            )}
            {event.startDate && (
              <p style={{ margin: 0 }}>
                Début : {new Date(event.startDate).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
