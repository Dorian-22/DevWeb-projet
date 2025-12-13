// backend/controllers/registrations-controller.js
const { Registration, Event, Category, Location, User } = require('../models');

const registrationsController = {
  // POST /events/:id/register (user)
  async registerToEvent(req, res) {
    try {
      const userId = req.user.id;
      const eventId = Number(req.params.id);

      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ error: 'Event not found' });

      // 1) Anti-doublon 
      const existing = await Registration.findOne({ where: { userId, eventId } });

      if (existing && existing.status === 'REGISTERED') {
        return res.status(409).json({ error: 'Already registered to this event' });
      }

      // 2) Capacité max 
      if (event.capacity != null) {
        const count = await Registration.count({
          where: { eventId, status: 'REGISTERED' },
        });

        if (count >= event.capacity) {
          return res.status(400).json({ error: 'Event is full' });
        }
      }

      // 3) Si inscription existante mais annulée => réactivation
      if (existing && existing.status === 'CANCELLED') {
        await existing.update({ status: 'REGISTERED' });
        return res.status(200).json(existing);
      }

      const registration = await Registration.create({
        userId,
        eventId,
        status: 'REGISTERED',
      });

      return res.status(201).json(registration);
    } catch (error) {
      console.error('Error registering to event:', error);
      return res.status(500).json({ error: 'Failed to register to event' });
    }
  },

  // GET /me/registrations (user)
  async myRegistrations(req, res) {
    try {
      const userId = req.user.id;

      const registrations = await Registration.findAll({
        where: { userId },
        include: [
          {
            model: Event,
            as: 'event',
            include: [
              { model: Category, as: 'category' },
              { model: Location, as: 'location' },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json(registrations);
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  },

  // GET /admin/events/:id/registrations (admin)
  async registrationsByEvent(req, res) {
    try {
      const eventId = Number(req.params.id);

      const registrations = await Registration.findAll({
        where: { eventId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'role', 'createdAt'], //  pas de passwordHash
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations for event:', error);
      res.status(500).json({ error: 'Failed to fetch event registrations' });
    }
  },
  // DELETE /events/:id/register
  async unregisterFromEvent(req, res) {
    try {
        const userId = req.user.id;
        const eventId = Number(req.params.id);

        const registration = await Registration.findOne({ where: { userId, eventId } });

        if (!registration || registration.status !== 'REGISTERED') {
        return res.status(404).json({ error: 'No active registration found' });
        }

        await registration.update({ status: 'CANCELLED' });
        return res.status(200).json({ message: 'Unregistered successfully' });
    } catch (error) {
        console.error('Error unregistering:', error);
        return res.status(500).json({ error: 'Failed to unregister' });
    }
  }

};

module.exports = registrationsController;
