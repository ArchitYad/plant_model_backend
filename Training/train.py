import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns 
import plotly.express as px

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, GlobalAveragePooling2D, Dense, Dropout, BatchNormalization, Input, Multiply
from tensorflow.keras.initializers import GlorotNormal
from tensorflow.keras.callbacks import ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import Model
from tensorflow import keras
from tensorflow.keras.optimizers import Adam


from keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array
from keras.callbacks import ModelCheckpoint, EarlyStopping
from keras.applications.resnet import ResNet101
from tensorflow.keras.applications import ResNet50
from keras.applications.vgg16 import VGG16
from tensorflow.keras.applications import EfficientNetV2L

import random
import os
import warnings
warnings.filterwarnings('ignore')
print('compelet')

image_shape = (224,224)
batch_size = 64

train_dir = "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/train"
valid_dir = "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/valid"

def attention_block(x):
    avg_pool = tf.keras.layers.GlobalAveragePooling2D()(x)
    avg_pool = tf.keras.layers.Reshape((1, 1, x.shape[-1]))(avg_pool)
    avg_pool = tf.keras.layers.Dense(x.shape[-1] // 8, activation='relu')(avg_pool)
    avg_pool = tf.keras.layers.Dense(x.shape[-1], activation='sigmoid')(avg_pool)
    
  
    out = Multiply()([x, avg_pool])
    return out


input_shape = (224, 224, 3)
inputs = Input(shape=input_shape)


x = Conv2D(32, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(inputs)
x = Conv2D(32, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(x)
x = MaxPooling2D((2, 2))(x)


x = Conv2D(64, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(x)
x = Conv2D(64, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(x)
x = MaxPooling2D((2, 2))(x)

x = attention_block(x)

x = Conv2D(128, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(x)
x = Conv2D(128, (3, 3), activation='elu', kernel_initializer='GlorotNormal')(x)
x = MaxPooling2D((2, 2))(x)


x = attention_block(x)


x = GlobalAveragePooling2D()(x)


x = Dense(256, activation='elu', kernel_initializer='GlorotNormal')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)

x = Dense(128, activation='elu', kernel_initializer='GlorotNormal')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)

x = Dense(64, activation='elu', kernel_initializer='GlorotNormal')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)


outputs = Dense(38, activation='softmax')(x)

model = Model(inputs=inputs, outputs=outputs)

model.compile(loss='categorical_crossentropy', optimizer=Adam(), metrics=['accuracy'])

model.summary()

from keras.callbacks import ModelCheckpoint, EarlyStopping


model_checkpoint = ModelCheckpoint('/kaggle/working/cnn_attention_model.keras', monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
early_stopping = EarlyStopping(monitor='val_accuracy', patience=3, verbose=1, mode='max', restore_best_weights=True)

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

test_dir = "/kaggle/input/new-plant-diseases-dataset/test/test"  # Update to your actual test directory path


test_datagen = ImageDataGenerator(rescale=1/255.)


print("Loading Test Images:")
test_data = test_datagen.flow_from_directory(test_dir,
                                             target_size=image_shape,
                                             batch_size=batch_size,
                                             class_mode='categorical',
                                             shuffle=False)

history = model.fit(train_data,
                    validation_data=valid_data,
                    epochs=10,
                    batch_size=batch_size,
                    callbacks=[model_checkpoint, early_stopping])


model.save('/kaggle/working/final_cnn_attention_model.h5')
