const mongoose = require('mongoose');
const detectionHistorySchema = new mongoose.Schema({
  plant: { 
    type: String, 
    required: true 
  },
  disease: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['Free', 'Premium'],
    default: 'Free'
  },
  trials: {
    type: Number,
    default: 2 
  },
  detectionHistory: [detectionHistorySchema], 
}, {
  timestamps: true 
});

module.exports = mongoose.model('collect', userSchema);