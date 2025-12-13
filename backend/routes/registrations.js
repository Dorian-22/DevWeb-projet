// backend/routes/registrations.js
const express = require('express');
const registrationsController = require('../controllers/registrations-controller');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/events/:id/register', requireAuth, registrationsController.registerToEvent);

module.exports = router;
