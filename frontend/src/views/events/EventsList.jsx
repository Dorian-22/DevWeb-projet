import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../../services/event-service';
import GenericTable from '../../components/GenericTable';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) return <p>Chargement des événements...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;
  if (!events.length) return <p>Aucun événement disponible.</p>;

  const columns = [
    { key: 'title', header: 'Titre' },
    {
      key: 'category',
      header: 'Catégorie',
      render: (e) => e.category?.name || '-',
    },
    {
      key: 'location',
      header: 'Lieu',
      render: (e) => (e.location ? `${e.location.name} (${e.location.city})` : '-'),
    },
    {
      key: 'startDate',
      header: 'Début',
      render: (e) => (e.startDate ? new Date(e.startDate).toLocaleString() : '-'),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (e) => e.status,
    },
  ];

  return (
    <div>
      <h1>Événements</h1>
      <GenericTable
        columns={columns}
        data={events}
        onRowClick={(row) => navigate(`/events/${row.id}`)}
      />
    </div>
  );
}

export default EventsList;
