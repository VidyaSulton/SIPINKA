const express = require('express');
const { createBooking, 
        getMyBookings, 
        getAllBookings, 
        getPublicBookings, 
        approveBooking, 
        rejectBooking, 
        deleteBooking
    } = require('../controllers/bookingControllers');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();
// Public route
router.get('/public', getPublicBookings);

// Protected routes - User & Admin (harus login)
router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.delete('/:userId', authenticate, deleteBooking);

// Hanya Admin saja
router.get('/', authenticate, isAdmin, getAllBookings);
router.put('/:peminjamanId/approve', authenticate, isAdmin, approveBooking);
router.put('/:peminjamanId/reject', authenticate, isAdmin, rejectBooking);

module.exports = router;