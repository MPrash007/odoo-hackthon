const express = require('express');
const router = express.Router();
const { getTrips, createTrip, getTrip, updateTrip, deleteTrip, getPublicTrip, togglePublic } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public/:id', getPublicTrip);
router.use(protect);
router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).put(updateTrip).delete(deleteTrip);
router.patch('/:id/toggle-public', togglePublic);

module.exports = router;
