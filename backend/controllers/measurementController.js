const Measurement = require('../models/measurementModel');

// @desc    Save new measurement data
// @route   POST /api/measurements
// @access  Public
const saveMeasurement = async (req, res) => {
  const { shoulders, waist, height } = req.body;

  if (!shoulders || !waist || !height) {
    return res.status(400).json({ error: 'Please provide all measurements' });
  }

  try {
    const newMeasurement = new Measurement({ shoulders, waist, height });
    await newMeasurement.save();
    res.status(201).json({ message: 'Measurement saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save measurement' });
  }
};

// @desc    Get all measurements
// @route   GET /api/measurements
// @access  Public
const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find();
    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve measurements' });
  }
};

module.exports = {
  saveMeasurement,
  getMeasurements,
};
