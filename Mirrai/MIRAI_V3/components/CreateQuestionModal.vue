<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h2>新規作成</h2>
      <div class="image-upload">
        <template v-if="uploadedImage && !croppedImage">
          <img :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" @click="handleClickOnImage" />
          <!-- <button @click="uploadNewImage">Upload New Image</button> -->
        </template>
        <template v-else-if="croppedImage">
          <img :src="croppedImage" alt="Cropped Image" class="uploaded-image" @click="handleClickOnImage" />
          <button @click="uploadNewImage">Upload New Image</button>
        </template>
        <template v-else>
          <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
          <img src="@/assets/images/admin-create-question-icon.svg" alt="Upload Icon" class="upload-icon" />
          <input type="file" @change="onFileChange" />
        </template>
      </div>
      <div>
        <label>問No.</label>
        <input type="text" v-model="questionNo" />
      </div>
      <div>
        <label>質問</label>
        <textarea v-model="questionText"></textarea>
      </div>
      <div class="answers">
        <div v-for="(answer, index) in answers" :key="index" class="answer">
          <label>{{ answerLabels[index] }}</label>
          <input type="text" v-model="answer.text" />
          <input type="radio" :value="index" v-model="correctAnswer" />
          <label>正答に設定</label>
        </div>
      </div>
      <div class="actions">
        <button @click="preview">プレビュー</button>
        <button @click="handleCreate">作成</button>
        <button @click="cancel">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(['cancel', 'create', 'preview']);

const questionNo = ref('');
const questionText = ref('');
const answers = ref([
  { text: '' },
  { text: '' },
  { text: '' },
  { text: '' },
]);
const correctAnswer = ref(null);

const uploadedImage = ref(null);
const croppedImage = ref(null);

const answerLabels = ['A', 'B', 'C', 'D'];

const onFileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadedImage.value = URL.createObjectURL(file);
  }
};

const handleClickOnImage = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', onFileChange);
  fileInput.click();
};

const uploadNewImage = () => {
  uploadedImage.value = null;
  croppedImage.value = null;
};

const cancel = () => {
  emit('cancel');
};

const handleCreate = () => {
  const newQuestion = {
    questionNo: questionNo.value,
    questionText: questionText.value,
    answers: answers.value,
    correctAnswer: correctAnswer.value,
  };
  emit('create', newQuestion);
};

const preview = () => {
  emit('preview');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}

.image-upload {
  border: 1px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.uploaded-image,
.upload-icon {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  margin-top: 20px;
  cursor: pointer;
}

.answers {
  margin-bottom: 20px;
}

.answer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
