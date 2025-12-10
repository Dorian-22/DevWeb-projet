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
};

module.exports = locationsController;
