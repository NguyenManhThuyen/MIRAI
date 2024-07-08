<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick($event)">
    <div class="modal-content" @click.stop>
      <span class="modal-close" @click="cancel">×</span>
      <h2>新規作成</h2>
      
      <!-- Image upload for question image -->
      <div class="image-upload">
        <template v-if="uploadedQuestionImage">
          <img :src="uploadedQuestionImage" alt="Uploaded Question Image" class="uploaded-image" @click="handleQuestionImageClick" />
        </template>
        <template v-else>
          <img src="@/assets/images/admin-create-question-icon.svg" alt="Upload Icon" class="upload-icon" />
          <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
          <label class="choose-file">
            ブラウザ
            <input type="file" @change="onQuestionFileChange" style="display: none;" />
          </label>
        </template>
      </div>

      <div class="form-group">
        <label for="questionNo">問No.</label>
        <input id="questionNo" type="text" v-model="questionNo" />
      </div>
      <div class="form-group">
        <label for="questionText">質問</label>
        <textarea id="questionText" v-model="questionText"></textarea>
      </div>

      <div class="tab-buttons">
        <button
          :class="{ active: activeTab === 'answers' }"
          @click="activeTab = 'answers'"
        >
          回答
        </button>
        <button
          :class="{ active: activeTab === 'description' }"
          @click="activeTab = 'description'"
        >
          説明
        </button>
      </div>

      <div v-if="activeTab === 'answers'" class="answers">
        <div v-for="(answer, index) in answers" :key="index" class="answer">
          <div class="answer-row">
            <div class="label-index">{{ answerLabels[index] }}</div>
            <input type="text" v-model="answer.text" />
          </div>
          <div class="answer-row-temp">
            <input type="radio" :value="index" v-model="correctAnswer" />
            <label class="label-answer">正答に設定</label>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'description'" class="tab-content">
        <!-- Image upload for explain image -->
        <div class="image-upload">
          <template v-if="uploadedExplainImage">
            <img :src="uploadedExplainImage" alt="Uploaded Explain Image" class="uploaded-image" @click="handleExplainImageClick" />
          </template>
          <template v-else>
            <img src="@/assets/images/admin-create-question-icon.svg" alt="Upload Icon" class="upload-icon" />
            <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
            <label class="choose-file">
              ブラウザ
              <input type="file" @change="onExplainFileChange" style="display: none;" />
            </label>
          </template>
        </div>
        <div class="form-group">
          <textarea id="questionDescription" v-model="questionDescription"></textarea>
        </div>
      </div>

      <div class="actions">
        <button @click="preview">プレビュー</button>
        <button @click="cancel">キャンセル</button>
        <button :disabled="loading" @click="handleCreate">作成</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const props = defineProps({
  visible: Boolean,
});

// Track active tab
let activeTab = ref('answers');

const emit = defineEmits(['cancel', 'create', 'preview']);

const questionNo = ref('');
const questionText = ref('');
const questionDescription = ref('');
const answers = ref([
  { text: '' },
  { text: '' },
  { text: '' },
  { text: '' },
]);
const correctAnswer = ref(null);

const uploadedQuestionImage = ref(null);
const uploadedExplainImage = ref(null);
const imageQuestion = ref('');
const imageExplain = ref('');

const answerLabels = ['A', 'B', 'C', 'D'];

const loading = ref(false);

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const onQuestionFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadedQuestionImage.value = URL.createObjectURL(file);
    imageQuestion.value = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
  }
};

const onExplainFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadedExplainImage.value = URL.createObjectURL(file);
    imageExplain.value = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
  }
};

const handleQuestionImageClick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', onQuestionFileChange);
  fileInput.click();
};

const handleExplainImageClick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', onExplainFileChange);
  fileInput.click();
};

const cancel = () => {
  // Emit event to cancel modal
  emit('cancel');

  // Reset all form fields
  questionNo.value = '';
  questionText.value = '';
  questionDescription.value = '';
  answers.value.forEach(answer => answer.text = '');
  correctAnswer.value = null;

  // Reset image upload state
  uploadedQuestionImage.value = null;
  uploadedExplainImage.value = null;
  imageQuestion.value = '';
  imageExplain.value = '';

  // Reset the input file elements themselves
  const fileInputs = document.querySelectorAll('.image-upload input[type="file"]');
  fileInputs.forEach(fileInput => {
    fileInput.value = ''; // Clear the selected file in the input
  });
};

const handleCreate = async () => {
  if (loading.value) return;

  loading.value = true;
  NProgress.start();

  // Generate the current timestamp for id
  const id = Date.now();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id}`;
  let qrCodeBase64 = '';

  try {
    // Fetch the QR code image and convert it to Base64
    const response = await axios.get(qrCodeUrl, { responseType: 'blob' });
    const blob = response.data;
    qrCodeBase64 = await toBase64(blob);
  } catch (error) {
    console.error('Error fetching QR code:', error);
  }

  // Prepare answers data
  const answersData = answers.value.map((answer, index) => ({
    id: index + id, // Use index as id for simplicity
    question_id: id,
    content: answer.text,
    is_correct: correctAnswer.value === index,
    created_user: 2662002, // Replace with actual user ID
  }));

  console.log(answersData);

  const newQuestion = {
    id,
    title: questionText.value,
    content: questionDescription.value,
    qrcode: qrCodeBase64, // Placeholder for QR code
    sort: parseInt(questionNo.value, 10),
    image_question: imageQuestion.value,
    image_explain: imageExplain.value,
    created_user: 1 // Replace with actual user ID
  };

  try {
    // Make the POST request to create question
    const questionResponse = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions', newQuestion);
    console.log('Create question response:', questionResponse.data);

    // Make the POST request to create answers
    const answersResponse = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/batchCreateItems', answersData);
    console.log('Create answers response:', answersResponse.data);

    emit('create', newQuestion);
    cancel();
  } catch (error) {
    console.error('Error creating question and answers:', error);
    cancel();
  } finally {
    loading.value = false;
    NProgress.done();
  }
};


const handleOverlayClick = (event) => {
  // Check if the click occurred outside the modal
  if (event.target === event.currentTarget) {
    cancel(); // Call cancel method when clicked outside the modal
  }
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
  max-width: 882px;
  width: 100%;
  position: relative; /* Để có thể định vị "x" ở góc phải của modal */
  padding: 32px;
  gap: 20px;
  border-radius: 16px;

  max-height: 85vh; /* Đặt chiều cao tối đa của modal là 80% chiều cao của viewport */
  overflow-y: auto; /* Cho phép nội dung cuộn khi vượt quá chiều cao */

  /* Hide scrollbar for WebKit browsers */
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for WebKit-based browsers */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Optional: just in case it's visible in some browser */
  }
}

.modal-content h2 {
  font-weight: bold; /* Độ đậm của font */
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  color: #000;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #000;
}

.tab-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-buttons button {
  padding: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  border-bottom: 3px solid transparent;

  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  color: #8F8F96;
}

.tab-buttons button.active {
  color: #2e7cf6;
  border-bottom-color: #2e7cf6;
}

.image-upload {
  margin-top: 20px;
  border: 2px dashed #ccc;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  background-color: #F1F4F9;
  padding: 21px;
  gap: 10px;
  border-radius: 16px;
}

.image-upload input[type="file"] {
  width: 100%; /* Chiều rộng của input là 100% */
  margin-left: auto; /* Căn phần tử sang phải */
  margin-right: auto; /* Căn phần tử sang trái */
  font-size: 0; /* Ẩn văn bản "No file chosen" */
  opacity: 0; /* Ẩn văn bản "No file chosen" */
}

.image-upload label.choose-file {
  display: inline-block;
  background-color: transparent;
  color: #8F8F96;
  cursor: pointer;
  border: 1px solid #4F5A62;
  border-radius: 4px;

  padding: 10px 20px 10px 20px;
  gap: 8px;
  border-radius: 7px;

  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}

.image-upload label.choose-file:hover {
  transform: scale(1.02);
}

.image-upload p {
  width: auto;
  max-width: 364px;
  margin-left: auto; /* Căn phần tử sang phải */
  margin-right: auto; /* Căn phần tử sang trái */
  margin-bottom: 12px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: #8F8F96;
  line-height: 1.8;
}

.tab-content {
  padding: 0 33px 20px 33px;
  gap: 30px;
}

.uploaded-image {
  display: flex;
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  justify-content: center; /* căn giữa theo chiều ngang */
  text-align: center; /* căn giữa nội dung trong phần tử */
  align-items: center; /* căn giữa theo chiều dọc */
  margin-left: auto;
  margin-right: auto;
}

.upload-icon {
  display: flex;
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  width: 56px;
  height: 40px;
  justify-content: center; /* căn giữa theo chiều ngang */
  text-align: center; /* căn giữa nội dung trong phần tử */
  align-items: center; /* căn giữa theo chiều dọc */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 20px;
  border-radius: 12px;
}

.form-group label {
  display: flex; /* Hiển thị label dưới dạng block để nằm trên input/textarea */
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px; /* Khoảng cách giữa label và input/textarea */
}

.form-group input,
.form-group textarea {
  width: 100%;
  height: 48px;
  padding: 10px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  line-height: 23px;
  border-radius: 12px;
  background-color: #F1F4F9;
  border: none;
  outline: none;
  font-weight: 400;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  color: #4B4B4D;
}

.form-group input {
  max-width: 255px;
}


.form-group textarea#questionText {
  height: fit-content; /* Điều chỉnh chiều cao cho textarea */
  min-height: 120px;
  border-radius: 12px;
}

.form-group textarea#questionDescription {
  height: fit-content; /* Điều chỉnh chiều cao cho textarea */
  border-radius: 12px;
  min-height: 204px;
}

.answers {
  margin-bottom: 10px;
}

.answer {
  display: flex;
  flex-direction: column; /* Định hướng các phần tử con theo chiều dọc */
  gap: 10px;
  border-radius: 12px;
  border: 1px solid #E3E4EC;
  padding: 10px; /* Thêm padding để tạo khoảng cách giữa các answer */
  margin-bottom: 10px;

}

.answer-row {
  display: flex; /* Sử dụng flexbox để các phần tử con nằm cùng 1 hàng */
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
  margin: 2px 8px 0 8px;
}

.label-index {
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  width: 40px;
  height: 40px;
  border: 2px solid #D6D6D6;
  border-radius: 50%;
  color: #0082CA;
  font-weight: bold;

  margin-right: 10px;
}

.answer-row input[type="text"] {
  flex: 1; /* Phần input text sẽ mở rộng theo chiều ngang */
  height: fit-content;
  min-height: 48px;
  padding: 9px 16px 9px 16px;
  border-radius: 8px;
  background: #F1F4F9;
  border: none;
  white-space: normal; /* Cho phép xuống dòng tự động khi cần */
  outline: none;
  
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #8F8F96;
}
.answer-row-temp {
  display: flex; /* Sử dụng flexbox để các phần tử con nằm cùng 1 hàng */
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
  justify-content: right;
  margin: 2px 8px 0 8px;
}

.answer-row input[type="radio"] {
  margin-right: 10px; /* Khoảng cách giữa input radio và label */
}

.label-answer {
  margin-left: 4px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  text-align: center;
  color: #8F8F96;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.actions button {
  width: 105px; /* Độ rộng 105px */
  height: 39px; /* Chiều cao 39px */
  border: none;
  gap: 10px;
  font-family: 'Noto Sans JP';
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  padding: 8px;
  gap: 4px;
  border-radius: 8px;
}

.actions button:first-child {
  margin-right: auto; /* Đảm bảo nút "プレビュー" sát lề trái */
  background-color: #F6B50C;
  color: rgb(255, 255, 255);
}

.actions button:nth-child(2) {
  color: #2e7cf6; /* Màu chữ xanh dương cho button thứ 2 */
  background-color: #ffffff;
  margin-right: 10px;
}

.actions button:nth-child(3) {
  color: #ffffff; /* Màu chữ trắng cho button thứ 3 */
  background-color: #2e7cf6; /* Nền xanh dương cho button thứ 3 */
  border: none; /* Xóa viền */
  border-radius: 8px; /* Bo tròn góc */
  padding: 10px 20px; /* Điều chỉnh padding */
}

.actions button:nth-child(3):hover {
  background-color: #256fb8; /* Màu nền khi hover */
}


</style>
