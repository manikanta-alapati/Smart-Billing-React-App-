# import required packages
import cv2
import argparse
import numpy as np
import io
import cv2
import base64
import numpy as np
from PIL import Image
from os import path

# Take in base64 string and return PIL image


def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

# convert PIL Image to an RGB image( technically a numpy array ) that's compatible with opencv


def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


def convertBase64ToImage(b64_string):
    return toRGB(stringToImage(b64_string))


def convertImagetoBase64(image_data):
    retval, buffer = cv2.imencode('.jpg', image_data)
    b64_bytes = base64.b64encode(buffer)
    b64_string = b64_bytes.decode()
    return b64_string


# handle command line arguments
# ap = argparse.ArgumentParser()
# ap.add_argument('-i', '--image', required=True,
#                 help='path to input image')
# ap.add_argument('-c', '--config', required=True,
#                 help='path to yolo config file')
# ap.add_argument('-w', '--weights', required=True,
#                 help='path to yolo pre-trained weights')
# ap.add_argument('-cl', '--classes', required=True,
#                 help='path to text file containing class names')
# args = ap.parse_args()

# function to get the output layer names
# in the architecture

def get_absolute_path(filename): return path.abspath(
    path.join("flaskr", "detection", filename))


weights_path = get_absolute_path("yolov3_training.weights")
config_path = get_absolute_path("yolov3_training.cfg")
classes_path = get_absolute_path("classes.txt")


# read class names from text file
classes = None
with open(classes_path, 'r') as f:
    classes = [line.strip() for line in f.readlines()]
# classes = ['doritos', 'kitkat_kingsize',
#            'kitkat_small', 'macaroni_cheese', 'trident']
# read pre-trained model and config file
net = cv2.dnn.readNet(weights_path, config_path)

# generate different colors for different classes
COLORS = np.random.uniform(0, 255, size=(len(classes), 3))


def get_output_layers(net):

    layer_names = net.getLayerNames()

    output_layers = [layer_names[i - 1]
                     for i in net.getUnconnectedOutLayers()]

    return output_layers

# function to draw bounding box on the detected object with class name


def draw_bounding_box(img, class_id, confidence, x, y, x_plus_w, y_plus_h):

    label = str(classes[class_id])

    color = COLORS[class_id]

    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2)

    cv2.putText(img, label, (x-10, y-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


def detect(b64_string):
    # read input image
    # image = cv2.imread(image_path)
    image = convertBase64ToImage(b64_string)

    Width = image.shape[1]
    Height = image.shape[0]
    print(image.shape)
    scale = 0.00392

    # create input blob
    blob = cv2.dnn.blobFromImage(
        image, scale, (416, 416), (0, 0, 0), True, crop=False)

    # set input blob for the network
    net.setInput(blob)

    # run inference through the network
    # and gather predictions from output layers
    outs = net.forward(get_output_layers(net))

    # initialization
    class_ids = []
    confidences = []
    boxes = []
    conf_threshold = 0.5
    nms_threshold = 0.4

    # for each detetion from each output layer
    # get the confidence, class id, bounding box params
    # and ignore weak detections (confidence < 0.5)
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.1:
                center_x = int(detection[0] * Width)
                center_y = int(detection[1] * Height)
                w = int(detection[2] * Width)
                h = int(detection[3] * Height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                class_ids.append(class_id)
                confidences.append(float(confidence))
                boxes.append([x, y, w, h])

    # apply non-max suppression
    indices = cv2.dnn.NMSBoxes(
        boxes, confidences, conf_threshold, nms_threshold)

    # go through the detections remaining
    # after nms and draw bounding box

    detected = {}

    for i in indices:
        box = boxes[i]
        x = box[0]
        y = box[1]
        w = box[2]
        h = box[3]

        class_name = str(classes[class_ids[i]])
        if class_name not in detected:
            detected[class_name] = 1
        else:
            detected[class_name] += 1
        draw_bounding_box(image, class_ids[i], confidences[i], round(
            x), round(y), round(x+w), round(y+h))

    # display output image
    # cv2.imshow("object detection", image)

    # wait until any key is pressed
    # cv2.waitKey()

    # save output image to disk
    # cv2.imwrite("object-detection.jpg", image)

    # release resources
    # cv2.destroyAllWindows()

    return {'detected': detected, 'output_image': convertImagetoBase64(image)}


# sample command
# python3 detection.py -i images\ 2/kitkat_small_00006.jpg -c yolov3_training.cfg -w yolov3_training_3000.weights -cl images\ 2/classes.txt

# print(detect(convertImagetoBase64(
#     cv2.imread('images 2/kitkat_small_00006.jpg'))))
