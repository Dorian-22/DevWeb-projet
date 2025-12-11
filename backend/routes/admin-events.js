// routes/admin-events.js
const express = require('express');
const eventsController = require('../controllers/events-controller');

const router = express.Router();

// Création d'un événement (admin)
router.post('/', eventsController.create);

// Mise à jour d'un événement (admin)
router.put('/:id', eventsController.update);

// Suppression d'un événement (admin)
router.delete('/:id', eventsController.remove);

module.exports = router;
