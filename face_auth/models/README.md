# Face Detection Models

This directory contains the model files required for face detection using OpenCV's DNN module.

Required files:
1. `res10_300x300_ssd_iter_140000.caffemodel` - The pre-trained model
2. `deploy.prototxt` - The model configuration file

To get these files:

1. Download the model file (res10_300x300_ssd_iter_140000.caffemodel):
   - Visit: https://github.com/opencv/opencv_3rdparty/blob/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel
   - Click 'Download' button

2. Download the configuration file (deploy.prototxt):
   - Visit: https://github.com/opencv/opencv/blob/master/samples/dnn/face_detector/deploy.prototxt
   - Click 'Raw' button
   - Save as 'deploy.prototxt'

Place both files in this directory before running the face recognition system.