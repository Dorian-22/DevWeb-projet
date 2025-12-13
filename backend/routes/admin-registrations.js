// backend/routes/admin-registrations.js
const express = require('express');
const registrationsController = require('../controllers/registrations-controller');

const router = express.Router();

router.get('/events/:id/registrations', registrationsController.registrationsByEvent);

module.exports = router;
