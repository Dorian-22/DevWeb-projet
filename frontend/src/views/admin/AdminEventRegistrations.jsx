import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GenericTable from '../../components/GenericTable';
import { fetchEventRegistrationsAdmin } from '../../services/registration-service';
import { fetchEventById } from '../../services/event-service';

function AdminEventRegistrations() {
  const { id } = useParams(); // eventId
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [evt, regs] = await Promise.all([
          fetchEventById(id),
          fetchEventRegistrationsAdmin(id),
        ]);
        setEvent(evt);
        setRegistrations(regs);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load event registrations');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Chargement des inscriptions...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  const columns = [
    {
      key: 'email',
      header: 'Email',
      render: (r) => r.user?.email || '-',
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (r) => r.user?.role || '-',
    },
    {
      key: 'status',
      header: 'Statut inscription',
      render: (r) => r.status,
    },
    {
      key: 'createdAt',
      header: 'Inscrit le',
      render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'),
    },
  ];

  return (
    <div>
      <h1>Inscriptions</h1>
      {event ? <p><strong>Événement :</strong> {event.title}</p> : null}

      <GenericTable columns={columns} data={registrations} getRowId={(r) => r.id} />
    </div>
  );
}

export default AdminEventRegistrations;
