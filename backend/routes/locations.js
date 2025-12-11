// routes/locations.js
const express = require('express');
const locationsController = require('../controllers/locations-controller');

const router = express.Router();

router.get('/', locationsController.list);
router.post('/', locationsController.create); // <--- ajouté

module.exports = router;
