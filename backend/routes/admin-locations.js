// routes/admin-locations.js
const express = require('express');
const locationsController = require('../controllers/locations-controller');

const router = express.Router();

// Création
router.post('/', locationsController.create);

// Mise à jour
router.put('/:id', locationsController.update);

// Suppression
router.delete('/:id', locationsController.remove);

module.exports = router;
