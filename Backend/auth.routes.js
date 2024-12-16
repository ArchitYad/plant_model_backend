const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.put('/update-plan', authController.isLoggedIn, authController.updatePlan);

module.exports = router;