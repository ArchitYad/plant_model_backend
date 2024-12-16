const express = require('express');
const multer = require('multer'); 
const detectController = require('./detect.controller');
const router = express.Router();
const authMiddleware=require('./auth.middleware');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


router.post('/diseases', upload.single('image'), authMiddleware.authenticate,detectController.detectDisease);

module.exports = router;