import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../components/GenericTable';
import { fetchMyRegistrations } from '../../services/registration-service';

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load registrations');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Chargement de tes inscriptions...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;
  if (!registrations.length) return <p>Tu n’as aucune inscription.</p>;

  const columns = [
    {
      key: 'eventTitle',
      header: 'Événement',
      render: (r) => r.event?.title || '-',
    },
    {
      key: 'date',
      header: 'Début',
      render: (r) => (r.event?.startDate ? new Date(r.event.startDate).toLocaleString() : '-'),
    },
    {
      key: 'place',
      header: 'Lieu',
      render: (r) =>
        r.event?.location ? `${r.event.location.name} (${r.event.location.city})` : '-',
    },
    {
      key: 'category',
      header: 'Catégorie',
      render: (r) => r.event?.category?.name || '-',
    },
    {
      key: 'status',
      header: 'Statut inscription',
      render: (r) => r.status,
    },
  ];

  return (
    <div>
      <h1>Mes inscriptions</h1>
      <GenericTable
        columns={columns}
        data={registrations}
        getRowId={(r) => r.id}
        onRowClick={(r) => {
          if (r.event?.id) navigate(`/events/${r.event.id}`);
        }}
      />
    </div>
  );
}

export default MyRegistrations;
