const PlantDisease = require('./plantd.model');
const User = require('./user.model');
const { predictDisease } = require('./model'); 
const fs = require('fs'); 
const path = require('path');
exports.detectDisease = async (req, res) => {
  const userEmail = req.user.email;  
  console.log(userEmail);

  const imagePath = path.join(__dirname, './uploads/', req.file.filename);

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.plan === 'Free' && user.trials <= 0) {
      return res.status(403).json({ success: false, message: 'No trials left. Upgrade to premium.' });
    }

    const prediction = await predictDisease(imagePath);

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Disease not recognized. We will work on this.' });
    }
    if (user.plan === 'Free') {
      user.trials -= 1;
      await user.save();
    }
    user.detectionHistory.push({
      plant: prediction.plant,
      disease: prediction.disease,
      date: new Date(),
    });
    await user.save();
    let tips = null;
    if (user.plan === 'Premium') {
      const plantDisease = await PlantDisease.findOne({
        plantName: prediction.plant,
        diseaseName: prediction.disease
      });
      tips = plantDisease ? plantDisease.tips : 'No tips available for this disease.';
    }
    res.status(200).json({
      success: true,
      disease: {
        plant: prediction.plant,
        disease: prediction.disease,
        tips: tips,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error in disease detection' });
  } 
};
