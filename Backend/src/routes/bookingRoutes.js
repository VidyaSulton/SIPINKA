const express = require('express');
const { createBooking, 
        getMyBookings, 
        getBookingById, 
        getAllBookings, 
        getPublicBookings, 
        approveBooking, 
        rejectBooking, 
        deleteBooking
    } = require('../controllers/bookingControllers');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/public', getPublicBookings);

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.delete('/:id', authenticate, deleteBooking);

router.get('/', authenticate, isAdmin, getAllBookings);
router.put('/:id/approve', authenticate, isAdmin, approveBooking);
router.put('/:id/reject', authenticate, isAdmin, rejectBooking);

module.exports = router;