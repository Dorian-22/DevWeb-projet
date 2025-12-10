const express = require('express');
const eventsController = require('../controllers/events-controller');

const router = express.Router();

// Liste publique des événements
router.get('/', eventsController.list);

// Détail d'un événement
router.get('/:id', eventsController.getById);

// Création d'un événement -> admin après
router.post('/', eventsController.create);

// Mise à jour d'un événement
router.put('/:id', eventsController.update);

// Suppression d'un événement
router.delete('/:id', eventsController.remove);

module.exports = router;
