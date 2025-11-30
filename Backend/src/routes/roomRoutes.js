const express = require('express');
const { getAllRooms, getRoomsById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomControllers');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes untuk public access/tidak perlu login
router.get('/', getAllRooms);
router.get('/id', getRoomsById);

// Routes yang perlu autentikasi dan hanya bisa diakses oleh admin
router.post('/', authenticate, isAdmin, createRoom);
router.put('/:id', authenticate, isAdmin, updateRoom);
router.delete('/:id', authenticate, isAdmin, deleteRoom);

module.exports = router;