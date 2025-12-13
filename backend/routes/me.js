// backend/routes/me.js
const express = require('express');
const registrationsController = require('../controllers/registrations-controller');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/registrations', requireAuth, registrationsController.myRegistrations);

module.exports = router;
