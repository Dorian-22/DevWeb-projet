// routes/admin-categories.js
const express = require('express');
const categoriesController = require('../controllers/categories-controller');

const router = express.Router();

// Création
router.post('/', categoriesController.create);

// Mise à jour
router.put('/:id', categoriesController.update);

// Suppression
router.delete('/:id', categoriesController.remove);

module.exports = router;
