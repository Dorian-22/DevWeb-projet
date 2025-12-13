// backend/routes/events.js
const express = require('express');
const eventsController = require('../controllers/events-controller');

const router = express.Router();

// Liste publique des événements
router.get('/', eventsController.list);

// Détail d'un événement
router.get('/:id', eventsController.getById);



module.exports = router;