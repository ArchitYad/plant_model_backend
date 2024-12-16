const mongoose = require('mongoose');

const plantDiseaseSchema = new mongoose.Schema({
  plantName: { 
    type: String, 
    required: true 
  },
  diseaseName: { 
    type: String, 
    required: true 
  },
  tips: { 
    type: String, 
    required: true 
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('plantdiseases', plantDiseaseSchema);