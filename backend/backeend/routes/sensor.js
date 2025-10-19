const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');
const Field = require('../models/field');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { fieldId, type, value, unit } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    const sensor = new Sensor({
      field: fieldId,
      type,
      value,
      unit,
    });

    await sensor.save();
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Error saving sensor data', error });
  }
});

router.get('/:fieldId', auth, async (req, res) => {
  try {
    const sensors = await Sensor.find({ field: req.params.fieldId }).sort({
      createdAt: -1,
    });
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensors', error });
  }
});

module.exports = router;
