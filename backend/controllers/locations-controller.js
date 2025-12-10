// controllers/locations-controller.js
const { Location } = require('../models');

const locationsController = {
  async list(req, res) {
    try {
      const locations = await Location.findAll({
        order: [['city', 'ASC'], ['name', 'ASC']],
      });
      res.json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  },

  async create(req, res) {
    try {
      const { name, address, city, capacity } = req.body;

      if (!name || !city) {
        return res.status(400).json({ error: 'Name and city are required' });
      }

      const location = await Location.create({
        name,
        address,
        city,
        capacity,
      });

      res.status(201).json(location);
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ error: 'Failed to create location' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, address, city, capacity } = req.body;

      const location = await Location.findByPk(id);

      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }

      await location.update({
        name,
        address,
        city,
        capacity,
      });

      res.json(location);
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ error: 'Failed to update location' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const location = await Location.findByPk(id);

      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }

      await location.destroy();

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ error: 'Failed to delete location' });
    }
  },
};

module.exports = locationsController;
