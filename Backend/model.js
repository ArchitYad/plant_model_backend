const ort = require('onnxruntime-node'); 
const sharp = require('sharp'); 
const path = require('path');

let session;

(async () => {
  try {
    const modelPath = path.join(__dirname, 'model.onnx'); 
    session = await ort.InferenceSession.create(modelPath);
    console.log('ONNX model loaded successfully');
  } catch (error) {
    console.error('Error loading ONNX model:', error);
  }
})();
const diseases = [
  { plant: "Apple", disease: "Apple Scab" },
  { plant: "Apple", disease: "Black Rot" },
  { plant: "Apple", disease: "Cedar Apple Rust" },
  { plant: "Apple", disease: "Healthy" },
  { plant: "Blueberry", disease: "Healthy" },
  { plant: "Cherry", disease: "Powdery Mildew" },
  { plant: "Cherry", disease: "Healthy" },
  { plant: "Corn", disease: "Cercospora Leaf Spot Gray Leaf Spot" },
  { plant: "Corn", disease: "Common Rust" },
  { plant: "Corn", disease: "Northern Leaf Blight" },
  { plant: "Corn", disease: "Healthy" },
  { plant: "Grape", disease: "Black Rot" },
  { plant: "Grape", disease: "Esca (Black Measles)" },
  { plant: "Grape", disease: "Leaf Blight (Isariopsis Leaf Spot)" },
  { plant: "Grape", disease: "Healthy" },
  { plant: "Orange", disease: "Huanglongbing (Citrus Greening)" },
  { plant: "Peach", disease: "Bacterial Spot" },
  { plant: "Peach", disease: "Healthy" },
  { plant: "Pepper", disease: "Bacterial Spot" },
  { plant: "Pepper", disease: "Healthy" },
  { plant: "Potato", disease: "Early Blight" },
  { plant: "Potato", disease: "Late Blight" },
  { plant: "Potato", disease: "Healthy" },
  { plant: "Raspberry", disease: "Healthy" },
  { plant: "Soybean", disease: "Healthy" },
  { plant: "Squash", disease: "Powdery Mildew" },
  { plant: "Strawberry", disease: "Leaf Scorch" },
  { plant: "Strawberry", disease: "Healthy" },
  { plant: "Tomato", disease: "Bacterial Spot" },
  { plant: "Tomato", disease: "Early Blight" },
  { plant: "Tomato", disease: "Late Blight" },
  { plant: "Tomato", disease: "Leaf Mold" },
  { plant: "Tomato", disease: "Septoria Leaf Spot" },
  { plant: "Tomato", disease: "Spider Mites (Two-Spotted Spider Mite)" },
  { plant: "Tomato", disease: "Target Spot" },
  { plant: "Tomato", disease: "Tomato Yellow Leaf Curl Virus" },
  { plant: "Tomato", disease: "Tomato Mosaic Virus" },
  { plant: "Tomato", disease: "Healthy" }
];
exports.predictDisease = async (imagePath) => {
  try {
    
    const tensor = await processImage(imagePath);

    const feeds = { args_0: tensor }; 

    const results = await session.run(feeds);

    const output = results.dense_23.data; 

    const maxIndex = output.indexOf(Math.max(...output));

    const predicted = diseases[maxIndex];

    return {
      plant: predicted.plant,
      disease: predicted.disease
    };

  } catch (error) {
    console.error('Error during prediction:', error);
    return null; 
  }
};

async function processImage(imagePath) {
  
  let image = await sharp(imagePath)
    .resize(224, 224) 
    .removeAlpha()    
    .raw()           
    .toBuffer();      
  const float32ImageData = new Float32Array(image.length);
  for (let i = 0; i < image.length; i++) {
    float32ImageData[i] = image[i] / 255.0; 
  }
  const tensor = new ort.Tensor('float32', float32ImageData, [1, 224, 224, 3]);

  return tensor; 
}