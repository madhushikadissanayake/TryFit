// routes/measurementRoutes.js

const express = require('express');
const router = express.Router();
const { saveMeasurement, getMeasurements } = require('../controllers/measurementController');

// POST /api/measurements - Save new measurement
router.post('/addmeasurement', saveMeasurement);

// GET /api/measurements - Get all measurements
router.get('/getmeasurement', getMeasurements);

module.exports = router;
