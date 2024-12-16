const express = require('express');
const supportController = require('./support.controller');
const authMiddleware = require('./auth.middleware');
const router = express.Router();

router.get('/tips/:username', authMiddleware.authenticate, supportController.getSupportDetails);

module.exports = router;