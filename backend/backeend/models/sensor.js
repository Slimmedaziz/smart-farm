const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema(
  {
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    type: {
      type: String,
      enum: ['temperature', 'humidity', 'soilMoisture', 'light', 'ph', 'other'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sensor', sensorSchema);
