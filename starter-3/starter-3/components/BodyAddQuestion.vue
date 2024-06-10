<template>
  <div class="container">
    <div class="add-question">
      <div class="add-image">
        <div class="upload-container">
          <button class="upload-button">
            <img class="plus-icon" :src="iconPlus" alt="Plus Icon">
            <span class="upload-text">写真をアップロードする</span>
          </button>
          <div v-if="showErrors && !bannerImageUploaded" class="error-message">まだバナー画像を追加していません</div>
        </div>
      </div>

      <div class="floor-display">
        <span>階</span>
        <input type="number" v-model.number="localFloor" class="floor-input" @input="updateFloor" />
        <div v-if="showErrors && !localFloor" class="error-message">階数が入力されていません</div>
      </div>

      <div class="question-section">
        <div class="question-header">
          <span class="question-label">質問1</span>
          <button class="add-question-button">質問を追加してください</button>
        </div>
        <div v-if="showErrors && !questionAdded" class="error-message">まだ質問を入力していません</div>

        <div class="options">
          <div v-for="(option, index) in options" :key="index" class="option-row">
            <input v-model="option.text" :placeholder="'オプション' + (index + 1)" />
            <button @click="removeOption(index)" class="remove-button">×</button>
            <div v-if="showErrors && !option.text" class="error-message">まだ答えの入力が終わっていません</div>
          </div>
          <button @click="addOption" class="add-option-button">+ さらに多くの回答</button>
        </div>
      </div>

      <div class="footer-image-upload">
        <button class="footer-upload-button">+ フッター画像をダウンロード</button>
        <div v-if="showErrors && !footerImageUploaded" class="error-message">フッター画像をまだ追加していません</div>
      </div>

      <button class="next-button" @click="validateForm">次に</button>
    </div>
  </div>
</template>

<script>
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
      localFloor: this.floor,
      options: [{ text: '' }, { text: '' }, { text: '' }],
      iconPlus: iconPlus,
      bannerImageUploaded: false,
      footerImageUploaded: false,
      questionAdded: false,
      showErrors: false, // Flag to control error message display
    };
  },
  methods: {
    addOption() {
      this.options.push({ text: '' });
    },
    removeOption(index) {
      this.options.splice(index, 1);
    },
    updateFloor(event) {
      const value = event.target.value;
      this.localFloor = value;
      this.$emit('update:floor', value);
    },
    validateForm() {
      // Set the showErrors flag to true to display the error messages
      this.showErrors = true;

      // Validate the form inputs
      const isBannerImageValid = this.bannerImageUploaded;
      const isFloorValid = this.localFloor;
      const isQuestionValid = this.questionAdded;
      const areOptionsValid = this.options.every(option => option.text);
      const isFooterImageValid = this.footerImageUploaded;

      if (isBannerImageValid && isFloorValid && isQuestionValid && areOptionsValid && isFooterImageValid) {
        // Form is valid, perform the next steps
        alert('Form submitted successfully!');
      } else {
        // Handle validation failure
        console.log('Form validation failed.');
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 819px;
  height: 901px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
}

.add-image {
  position: relative;
  height: 184px;
  background: #BDBDBD;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.plus-icon {
  width: 24px;
  height: 24px;
}

.upload-text {
  font-size: 14px;
  color: white;
  margin-top: 8px;
}

.floor-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.floor-display span {
  margin-right: 8px;
  border: 1px solid #1A1A1A;
  padding: 4px 8px;
}

.question-section {
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: #1A1A1A;
  padding: 8px 16px;
  border: 1px solid #1A1A1A;
  border-radius: 4px;
}

.question-label {
  color: white;
}

.add-question-button {
  background: none;
  border: none;
  color: #FF4081;
  cursor: pointer;
}

.options {
  display: flex;
  flex-direction: column;
}

.option-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-direction: column;
}

.option-row input {
  flex-grow: 1;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
}

.remove-button {
  background: none;
  border: none;
  color: #FF4081;
  cursor: pointer;
}

.add-option-button {
  background: none;
  border: none;
  color: #FF4081;
  cursor: pointer;
}

.footer-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.footer-upload-button {
  background: none;
  border: none;
  color: #FF4081;
  cursor: pointer;
}

.next-button {
  width: 100%;
  padding: 12px;
  background-color: #FF4081;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>

