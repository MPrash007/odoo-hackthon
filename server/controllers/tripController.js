const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const ChecklistItem = require('../models/ChecklistItem');
const Note = require('../models/Note');

// GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/trips/:id
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    // Clean up related data
    await Itinerary.deleteMany({ trip: trip._id });
    await ChecklistItem.deleteMany({ trip: trip._id });
    await Note.deleteMany({ trip: trip._id });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/trips/public/:id
exports.getPublicTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, isPublic: true }).populate('user', 'firstName lastName profilePhoto');
    if (!trip) return res.status(404).json({ message: 'Trip not found or not public' });
    const itinerary = await Itinerary.findOne({ trip: trip._id });
    res.json({ trip, itinerary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/trips/:id/toggle-public
exports.togglePublic = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.isPublic = !trip.isPublic;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
