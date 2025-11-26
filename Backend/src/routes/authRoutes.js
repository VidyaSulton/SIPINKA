const express = require('express');
const { register, login } = require('../controllers/authControllers');

const router = express.Router();

// POST method http untuk register
router.post('/register', register);

// POST method http untuk login
router.post('/login', login);

module.exports = router;