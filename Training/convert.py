import tensorflow as tf
import tf2onnx

model = tf.keras.models.load_model('pmc.h5')

spec = (tf.TensorSpec([None, 224, 224, 3], tf.float32),)  
onnx_model, _ = tf2onnx.convert.from_keras(model, input_signature=spec)

with open('model.onnx', 'wb') as f:
    f.write(onnx_model.SerializeToString())

print("Model successfully converted and saved as model.onnx")
