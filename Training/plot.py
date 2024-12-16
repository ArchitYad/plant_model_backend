import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical
import pandas as pd

image_shape = (224, 224)
batch_size = 64
train_dir = "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/train"
valid_dir = "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/valid"

train_datagen = ImageDataGenerator(rescale=1/255., validation_split=0.2)  # Rescaling and 20% validation split
test_datagen = ImageDataGenerator(rescale=1/255.)

train_data = train_datagen.flow_from_directory(train_dir,
                                               target_size=image_shape,
                                               batch_size=batch_size,
                                               class_mode='categorical',
                                               shuffle=True,
                                               subset='training')

valid_data = train_datagen.flow_from_directory(train_dir,
                                               target_size=image_shape,
                                               batch_size=batch_size,
                                               class_mode='categorical',
                                               shuffle=False,
                                               subset='validation')

class_labels = list(train_data.class_indices.keys())
print("The model can detect the following plant diseases:")
for label in class_labels:
    print(label)

model=load_model('/kaggle/input/plant_disease_checker/tensorflow2/default/1/final_test_cnn_attention_model.h5')

valid_data.reset()  # Reset the generator to ensure predictions are in order
predictions = model.predict(valid_data, verbose=1)  # Removed the steps argument

predicted_classes = np.argmax(predictions, axis=1)

true_classes = valid_data.classes

print(f"True classes: {len(true_classes)}, Predicted classes: {len(predicted_classes)}")

cm = confusion_matrix(true_classes, predicted_classes)

def plot_confusion_matrix(cm, labels):
    df_cm = pd.DataFrame(cm, index=labels, columns=labels)
    plt.figure(figsize=(10, 8))
    sns.heatmap(df_cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.xticks(rotation=90)
    plt.show()


plot_confusion_matrix(cm, class_labels)
