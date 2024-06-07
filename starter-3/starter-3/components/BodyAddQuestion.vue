<template>
  <div class="container">
    <div class="add-question">
      <div class="add-image">
        <img class="add-image-background" :src="addImageBackground" alt="Add Image Background">
        <div class="image-icons-container">
          <img class="add-image-icon" :src="addImageIcon" alt="Add Image Icon">
          <div class="upload-text-container">
            <img class="plus-icon" src="@/assets/images/icon_plus.svg" alt="Plus Icon">
            <span class="upload-text">写真をアップロードする</span>
          </div>
        </div>
      </div>
      
      <!-- New class to display floor number -->
      <div class="floor-display">
        <h2>{{ floor }}階</h2>
      </div>

      <!-- Button for adding an image -->
      <button class="add-image-button">写真をアップロードする</button>

      <!-- Numeric input for Answer 1 -->
      <input v-model="answer1" placeholder="回答1" />

      <!-- Text input fields for options -->
      <div v-for="(option, index) in options" :key="index" class="option-row">
        <input v-model="option.text" :placeholder="'オプション' + (index + 1)" />
        <button @click="removeOption(index)">×</button>
      </div>

      <!-- Button to add more answers -->
      <button @click="addOption">+ さらにくの回答</button>

      <!-- Next button -->
      <button class="next-button">次へ</button>
    </div>
  </div>
</template>

<script>
import addImageIcon from "@/assets/images/add_image_icon.svg";
import addImageBackground from "@/assets/images/add_image_background2.svg";
import iconPlus from "@/assets/images/icon_plus.svg";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      answer1: '',
      options: [{ text: '' }],
      addImageIcon: addImageIcon,
      addImageBackground: addImageBackground,
      iconPlus: iconPlus,
    };
  },
  mounted() {
    console.log('ID received:', this.id);
    console.log('Floor received:', this.floor);
  },
  methods: {
    addOption() {
      this.options.push({ text: '' });
    },
    removeOption(index) {
      this.options.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.container {
  width: 819px;
  height: 901px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: white;
}

.add-image {
  position: relative;
  height: 184px;
  background: #BDBDBD;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-image-background {
  position: absolute;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-icons-container {
  position: absolute;
  top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.add-image-icon {
  margin-top: 24px;
}

.upload-text-container {
  margin-top: 8px;
  padding: 10px 10px 10px 16px;
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 12px;
  gap: 8px;
}

.plus-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px; /* Optional: Adjust space between icon and text */
}

.upload-text {
  font-size: 14px;
  color: white;
}

/* New class for displaying floor number */
.floor-display {
  width: 181px;
  height: 52px;
  margin: 16px auto;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border: 1px solid black;
  border-radius: 12px;
}

.floor-display h2 {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  color: #1A1A1A;
}
</style>
