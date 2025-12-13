// backend/routes/locations.js
const express = require('express');
const locationsController = require('../controllers/locations-controller');

const router = express.Router();

// Liste publique seulement
router.get('/', locationsController.list);

// SUPPRIMER router.post('/', locationsController.create);

module.exports = router;