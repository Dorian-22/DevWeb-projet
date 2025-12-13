// backend/controllers/events-controller.js
const { Event, Category, Location } = require('../models');

module.exports = {
  // Liste publique (seulement les événements publiés)
  list: async (req, res) => {
    try {
      console.log('Liste des événements publics');
      const events = await Event.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' }
        ],
        where: { status: 'published' } // IMPORTANT: seulement publiés
      });
      console.log(`${events.length} événements trouvés`);
      res.json(events);
    } catch (error) {
      console.error('Erreur liste events:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Détail public
  getById: async (req, res) => {
    try {
      console.log(`Détail événement ID: ${req.params.id}`);
      const event = await Event.findByPk(req.params.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' }
        ]
      });
      
      if (!event) {
        console.log(`Événement ${req.params.id} non trouvé`);
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      console.log(`Événement ${req.params.id} trouvé`);
      res.json(event);
    } catch (error) {
      console.error('Erreur détail event:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Création (admin seulement)
  create: async (req, res) => {
    try {
      console.log('Création événement:', req.body);
      
      // Ajouter le createdBy si l'utilisateur est connecté
      const eventData = req.body;
      if (req.user) {
        eventData.createdBy = req.user.id;
        console.log(`Créé par user ID: ${req.user.id}`);
      }
      
      const event = await Event.create(eventData);
      
      // Retourner avec les relations
      const eventWithRelations = await Event.findByPk(event.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' }
        ]
      });
      
      console.log(`Événement créé ID: ${event.id}`);
      res.status(201).json(eventWithRelations);
    } catch (error) {
      console.error('Erreur création event:', error);
      res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
  },

  // Mise à jour (admin seulement)
  update: async (req, res) => {
    try {
      console.log(`Mise à jour événement ID: ${req.params.id}`, req.body);
      
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        console.log(`Événement ${req.params.id} non trouvé pour mise à jour`);
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      await event.update(req.body);
      
      // Retourner avec les relations
      const updatedEvent = await Event.findByPk(event.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' }
        ]
      });
      
      console.log(`Événement ${req.params.id} mis à jour`);
      res.json(updatedEvent);
    } catch (error) {
      console.error('Erreur mise à jour event:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Suppression (admin seulement)
  remove: async (req, res) => {
    try {
      console.log(`Suppression événement ID: ${req.params.id}`);
      
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        console.log(`Événement ${req.params.id} non trouvé pour suppression`);
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      await event.destroy();
      console.log(`Événement ${req.params.id} supprimé`);
      res.status(204).send();
    } catch (error) {
      console.error('Erreur suppression event:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};