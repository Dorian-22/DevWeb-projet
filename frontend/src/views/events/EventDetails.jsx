// src/views/events/EventDetails.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchEventById, adminDeleteEvent } from '../../services/event-service';

import { registerToEvent } from '../../services/registration-service';
// + si tu as useAuth :
import { useAuth } from '../../context/AuthContext'; // adapte le chemin

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const { user, isAuthenticated, isAdmin } = useAuth();

 



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
    async function handleDelete() {
        const confirmDelete = window.confirm(
            "Es-tu sûr de vouloir supprimer cet événement ? Cette action est définitive."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);
            await adminDeleteEvent(id);
            // Une fois supprimé, on retourne à la liste des événements
            navigate('/events');
        } catch (err) {
            console.error('Error deleting event:', err);
            setError(err.message || 'Failed to delete event');
        } finally {
            setDeleting(false);
        }
    }

    async function handleRegister() {
      try {
        setRegistering(true);
        setSuccessMsg(null);
        setError(null);
        await registerToEvent(id);
        setSuccessMsg(" Inscription réussie !");
      } catch (err) {
        setError(err.message || "Impossible de s'inscrire");
      } finally {
        setRegistering(false);
      }
    }


  return (
    <div>
      <p>
        <Link to="/events">&larr; Retour à la liste</Link>
      </p>

      <h1>{event.title}</h1>

      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      {/* 👤 ADMIN ACTIONS */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '12px 0' }}>
          <Link to={`/admin/events/${event.id}/edit`}>
            <button type="button">Modifier</button>
          </Link>

          <Link to={`/admin/events/${event.id}/registrations`}>
            <button type="button">Voir inscriptions</button>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              backgroundColor: '#c0392b',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      )}

      {/* 👤 USER ACTION */}
      {isAuthenticated && !isAdmin && (
        <button type="button" onClick={handleRegister} disabled={registering}>
          {registering ? 'Inscription...' : "S'inscrire à cet événement"}
        </button>
      )}

      {/* 👤 VISITEUR */}
      {!isAuthenticated && (
        <p style={{ fontStyle: 'italic' }}>Connectez-vous pour vous inscrire à cet événement.</p>
      )}


      {error && (
        <p style={{ color: 'red' }}>
          Erreur : {error}
        </p>
      )}

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
