const express = require('express');
const router = express.Router();
const City = require('../models/City');

// GET /api/cities?q=paris&region=europe
router.get('/', async (req, res) => {
  try {
    const { q, region } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (region) filter.region = { $regex: region, $options: 'i' };
    const cities = await City.find(filter).sort({ popularity: -1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/cities/:id
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
