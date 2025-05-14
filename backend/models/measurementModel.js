// models/measurementModel.js

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  shoulders: {
    type: Number,
    required: true,
  },
  waist: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Measurement', measurementSchema);
