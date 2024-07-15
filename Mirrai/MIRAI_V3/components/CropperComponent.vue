<template>
  <div class="cropper-wrapper">
    <Cropper
      ref="cropperRef"
      :src="imageUrl"
      :auto-zoom="true"
      @change="change"
      style="height: 100%; width: 100%; min-height: 300px; max-height: 400px"
      image-restriction="stencil"
    />

    <!-- Control buttons -->
    <div class="cropper-controls">
      <button class="control-button" @click="rotateLeft" title="Rotate Left">
        <FontAwesomeIcon :icon="faRotateLeft" />
      </button>
      <button class="control-button" @click="rotateRight" title="Rotate Right">
        <FontAwesomeIcon :icon="faRotateRight" />
      </button>
      <button class="control-button" @click="flipHorizontal" title="Flip Horizontal">
        <FontAwesomeIcon :icon="faArrowsH" />
      </button>
      <button class="control-button" @click="flipVertical" title="Flip Vertical">
        <FontAwesomeIcon :icon="faArrowsV" />
      </button>
      <button class="control-button" @click="zoomIn" title="Zoom In">
        <FontAwesomeIcon :icon="faSearchPlus" />
      </button>
      <button class="control-button" @click="zoomOut" title="Zoom Out">
        <FontAwesomeIcon :icon="faSearchMinus" />
      </button>
      <button class="control-button" @click="reset" title="Reset">
        <FontAwesomeIcon :icon="faSyncAlt" />
      </button>

      <button class="control-button save-button" @click="saveCrop" title="Save">
        <FontAwesomeIcon :icon="faSave" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRotateLeft, faRotateRight, faArrowsH, faArrowsV, faSearchPlus, faSearchMinus, faSyncAlt, faSave } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['cropped', 'cancel']);

const imageUrl = ref(props.imageUrl);
const cropperRef = ref(null);

const change = ({ coordinates, canvas }) => {
  console.log(coordinates, canvas);
};

const rotateLeft = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.rotate(-90);
  }
};

const rotateRight = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.rotate(90);
  }
};

const flipHorizontal = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.flip(true, false);
  }
};

const flipVertical = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.flip(false, true);
  }
};

const zoomIn = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.zoom(1.1);
  }
};

const zoomOut = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.zoom(0.9);
  }
};

const reset = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    cropperInstance.reset();
  }
};

const saveCrop = () => {
  const cropperInstance = cropperRef.value;
  if (cropperInstance) {
    const croppedCanvas = cropperInstance.getResult().canvas;
    const croppedImage = croppedCanvas.toDataURL();
    emit('cropped', croppedImage);
  }
};

const cancelCrop = () => {
  emit('cancel');
};
</script>

<style scoped>
.cropper-wrapper {
  position: relative;
  height: 500px; /* Set the container height */
  overflow: hidden; /* Hide overflow for the blurred background effect */
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
  filter: blur(10px); /* Adjust blur strength as needed */
  z-index: -1; /* Push it behind the cropper */
}

.cropper-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 10px;
}

.control-button {
  padding: 8px 16px;
  color: white;
  background-color: #2E7CF6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
}

.control-button.save-button {
  background-color: green;
}

.control-button.cancel-button {
  background-color: #FF6347; /* Red color for cancel button */
}

.control-button:hover {
  opacity: 0.8;
}

.control-button:focus {
  outline: none;
}

input[type="range"] {
  width: 150px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: #2E7CF6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background-color: #2E7CF6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]:focus {
  outline: none;
}
</style>
