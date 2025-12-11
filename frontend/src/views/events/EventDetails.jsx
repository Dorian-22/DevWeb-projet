// src/views/events/EventDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById } from '../../services/event-service';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error loading event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return <p>Chargement de l&apos;événement...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Erreur : {error}</p>;
  }

  if (!event) {
    return <p>Événement introuvable.</p>;
  }

  return (
    <div>
      <p>
        <Link to="/events">&larr; Retour à la liste</Link>
      </p>

      <h1>{event.title}</h1>

      {event.category && (
        <p>
          <strong>Catégorie :</strong> {event.category.name}
        </p>
      )}

      {event.location && (
        <p>
          <strong>Lieu :</strong> {event.location.name} ({event.location.city})
          {event.location.address && ` – ${event.location.address}`}
        </p>
      )}

      {event.startDate && (
        <p>
          <strong>Début :</strong>{' '}
          {new Date(event.startDate).toLocaleString()}
        </p>
      )}

      {event.endDate && (
        <p>
          <strong>Fin :</strong> {new Date(event.endDate).toLocaleString()}
        </p>
      )}

      {event.capacity != null && (
        <p>
          <strong>Capacité :</strong> {event.capacity} personnes
        </p>
      )}

      <p>
        <strong>Statut :</strong> {event.status}
      </p>

      {event.description && (
        <>
          <h2>Description</h2>
          <p>{event.description}</p>
        </>
      )}
    </div>
  );
}

export default EventDetails;
