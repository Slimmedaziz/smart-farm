const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const auth = require('../middleware/auth');

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, cropType, location } = req.body;

    if (!name || !cropType || !location) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const field = new Field({
      name,
      cropType,
      location,
      user: req.user.userId  // ← Changed from req.user.id
    });

    await field.save();
    res.status(201).json(field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get all fields
router.get('/', auth, async (req, res) => {
  try {
    const fields = await Field.find({ user: req.user.userId }).sort({ createdAt: -1 });  // ← Changed
    res.json(fields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get single field
router.get('/:id', auth, async (req, res) => {
  try {
    const field = await Field.findOne({ _id: req.params.id, user: req.user.userId });  // ← Changed
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json(field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, cropType, location } = req.body;

    const field = await Field.findOne({ _id: req.params.id, user: req.user.userId });  // ← Changed
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    field.name = name || field.name;
    field.cropType = cropType || field.cropType;
    field.location = location || field.location;

    await field.save();
    res.json(field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({ _id: req.params.id, user: req.user.userId });  // ← Changed
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;