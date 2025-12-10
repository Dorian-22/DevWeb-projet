const { Event, Category, Location } = require('../models');

const eventsController = {
  async list(req, res) {
    try {
      const events = await Event.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' },
        ],
        order: [['startDate', 'ASC']],
      });
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Location, as: 'location' },
        ],
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

  async create(req, res) {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        capacity,
        status,
        categoryId,
        locationId,
      } = req.body;

      const event = await Event.create({
        title,
        description,
        startDate,
        endDate,
        capacity,
        status,
        categoryId,
        locationId,
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        startDate,
        endDate,
        capacity,
        status,
        categoryId,
        locationId,
      } = req.body;

      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      await event.update({
        title,
        description,
        startDate,
        endDate,
        capacity,
        status,
        categoryId,
        locationId,
      });

      res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      await event.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },
};

module.exports = eventsController;
