// routes/categories.js
const express = require('express');
const categoriesController = require('../controllers/categories-controller');

const router = express.Router();

router.get('/', categoriesController.list);
router.post('/', categoriesController.create); 

module.exports = router;
