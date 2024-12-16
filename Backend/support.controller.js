const User = require('./user.model');
const PlantDisease = require('./plantd.model'); 

exports.getSupportDetails = async (req, res) => {
  const username = req.params.username;  

  try {
    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.detectionHistory || user.detectionHistory.length === 0) {
      return res.status(404).json({ success: false, message: 'No detection history found for this user.' });
    }

    const detectionPairs = user.detectionHistory.map(detection => ({
      plantName: detection.plant,
      diseaseName: detection.disease
    }));

    const plantDiseases = await PlantDisease.find({
      $or: detectionPairs.map(pair => ({
        plantName: pair.plantName,
        diseaseName: pair.diseaseName
      }))
    });

    const plantDiseaseMap = plantDiseases.reduce((map, plantDisease) => {
      const key = `${plantDisease.plantName}-${plantDisease.diseaseName}`;
      map[key] = plantDisease.tips;
      return map;
    }, {});

    const historyWithTips = user.detectionHistory.map(detection => {
      const key = `${detection.plant}-${detection.disease}`;
      const tips = plantDiseaseMap[key] || 'No tips available for this disease.';

      return {
        plant: detection.plant,
        disease: detection.disease,
        date: detection.date,
        tips: tips
      };
    });
    return res.status(200).json({
      success: true,
      history: historyWithTips
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching support details.' });
  }
};