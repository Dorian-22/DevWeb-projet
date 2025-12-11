// src/views/admin/AdminEventForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchEventById, adminCreateEvent, adminUpdateEvent } from '../../services/event-service';
import { fetchCategories } from '../../services/category-service';
import { fetchLocations } from '../../services/location-service';

function AdminEventForm() {
  const { id } = useParams(); // si id existe -> édition, sinon création
  const isEditMode = Boolean(id);

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: '',
    status: 'draft',
    categoryId: '',
    locationId: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Charger catégories + lieux (+ event si édition)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [cats, locs] = await Promise.all([
          fetchCategories(),
          fetchLocations(),
        ]);

        setCategories(cats);
        setLocations(locs);

        if (isEditMode) {
          const existingEvent = await fetchEventById(id);

          setFormValues({
            title: existingEvent.title || '',
            description: existingEvent.description || '',
            // Formatage pour input type="datetime-local"
            startDate: existingEvent.startDate
              ? toLocalInputValue(existingEvent.startDate)
              : '',
            endDate: existingEvent.endDate
              ? toLocalInputValue(existingEvent.endDate)
              : '',
            capacity: existingEvent.capacity ?? '',
            status: existingEvent.status || 'draft',
            categoryId: existingEvent.categoryId || '',
            locationId: existingEvent.locationId || '',
          });
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError(err.message || 'Failed to load form data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isEditMode]);

  function toLocalInputValue(dateString) {
    const date = new Date(dateString);
    
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function fromLocalInputValue(value) {
    if (!value) return null;
    
    return new Date(value).toISOString();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Construction du payload pour l'API
      const payload = {
        title: formValues.title,
        description: formValues.description || null,
        startDate: fromLocalInputValue(formValues.startDate),
        endDate: formValues.endDate ? fromLocalInputValue(formValues.endDate) : null,
        capacity: formValues.capacity !== '' ? Number(formValues.capacity) : null,
        status: formValues.status,
        categoryId: formValues.categoryId ? Number(formValues.categoryId) : null,
        locationId: formValues.locationId ? Number(formValues.locationId) : null,
      };

      let savedEvent;
      if (isEditMode) {
        savedEvent = await adminUpdateEvent(id, payload);
      } else {
        savedEvent = await adminCreateEvent(payload);
      }

      // Une fois sauvegardé, on peut rediriger vers la page de détail 
      navigate(`/events/${savedEvent.id}`);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Chargement du formulaire...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>Erreur : {error}</p>
        <p>
          <button type="button" onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        <Link to="/events">&larr; Retour à la liste des événements</Link>
      </p>

      <h1>{isEditMode ? 'Modifier un événement' : 'Créer un nouvel événement'}</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>
            Titre *
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '6px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Description
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              rows={4}
              style={{ display: 'block', width: '100%', padding: '6px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Date de début *
            <input
              type="datetime-local"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
              required
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Date de fin
            <input
              type="datetime-local"
              name="endDate"
              value={formValues.endDate}
              onChange={handleChange}
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Capacité
            <input
              type="number"
              name="capacity"
              value={formValues.capacity}
              onChange={handleChange}
              min="0"
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Statut *
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              required
              style={{ display: 'block', padding: '6px' }}
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="cancelled">Annulé</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Catégorie *
            <select
              name="categoryId"
              value={formValues.categoryId}
              onChange={handleChange}
              required
              style={{ display: 'block', padding: '6px' }}
            >
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Lieu *
            <select
              name="locationId"
              value={formValues.locationId}
              onChange={handleChange}
              required
              style={{ display: 'block', padding: '6px' }}
            >
              <option value="">-- Choisir un lieu --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.city})
                </option>
              ))}
            </select>
          </label>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Les champs marqués d&apos;une * sont obligatoires.
        </p>

        <button type="submit" disabled={saving}>
          {saving
            ? isEditMode
              ? 'Enregistrement...'
              : 'Création...'
            : isEditMode
              ? 'Enregistrer les modifications'
              : 'Créer l’événement'}
        </button>
      </form>
    </div>
  );
}

export default AdminEventForm;
