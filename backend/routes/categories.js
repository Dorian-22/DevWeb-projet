// backend/routes/categories.js
const express = require('express');
const categoriesController = require('../controllers/categories-controller');

const router = express.Router();

// Liste publique seulement
router.get('/', categoriesController.list);

// SUPPRIMER router.post('/', categoriesController.create);

module.exports = router;