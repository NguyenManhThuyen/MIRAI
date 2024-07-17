<template>
  <div v-if="showUpperModal" class="modal-overlay" @click="handleOverlayClick($event)">
    <div class="modal-content" @click.stop>
      <span class="modal-close" @click="cancel">×</span>
      <h2>新規作成</h2>
      
      <!-- Image upload for question image -->
      <div class="image-upload">
        <template v-if="uploadedQuestionImage">
          <img :src="uploadedQuestionImage"  class="uploaded-image" @click="handleQuestionImageClick" />
        </template>
        <template v-else>
          <img src="@/assets/images/admin-create-question-icon.svg"  class="upload-icon" />
          <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
          <label class="choose-file">
            データから選択
            <input type="file" @change="onQuestionFileChange" style="display: none;" />
          </label>
        </template>
      </div>

      <div class="form-group">
        <label for="questionNo">問No.</label>
        <input id="questionNo" type="number" v-model="questionNo" />
        <p v-if="errors.questionNo" class="error-message">{{ errors.questionNo }}</p>
      </div>
      <div class="form-group">
        <label for="questionText">問題</label>
        <textarea id="questionText" v-model="questionText" style="resize: none;"></textarea>

        <p v-if="errors.questionText" class="error-message">{{ errors.questionText }}</p>
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
          <div class="answer-row-temp" :style="{ justifyContent: errors.answers[index] ? 'space-between' : 'flex-end' }">
            <p v-if="errors.answers[index]" class="error-message">{{ errors.answers[index] }}</p>
            <div>
              <input type="radio" :value="index" v-model="correctAnswer" />
              <label class="label-answer">正答に設定</label>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'description'" class="tab-content">
        <!-- Image upload for explain image -->
        <div class="image-upload">
          <template v-if="uploadedExplainImage">
            <img :src="uploadedExplainImage"  class="uploaded-image" @click="handleExplainImageClick" />
          </template>
          <template v-else>
            <img src="@/assets/images/admin-create-question-icon.svg"  class="upload-icon" />
            <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
            <label class="choose-file">
              データから選択
              <input type="file" @change="onExplainFileChange" style="display: none;" />
            </label>
          </template>
        </div>
        <div class="form-group">
          <textarea id="questionDescription" v-model="questionDescription" style="resize: none;"></textarea>
        </div>
      </div>

      <div class="actions">
        <button @click="preview">プレビュー</button>
        <button @click="cancel">キャンセル</button>
        <button :disabled="loading" @click="handleCreate">作成</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" v-if="previewVisible" @click.self="closePreviewModal">
    <div class="modal-content-preview">
      <div class="quiz-container">
        <HeaderQuestionUser />
        <HeaderStampQuestionUser />
        <div class="quiz-body">
          <img v-if="imageQuestion" :src="getFullImageUrl(imageQuestion)" alt="Question Image" />
          <div class="question-text">
            <h2>問題{{questionNo}}:</h2>
          </div>
          <p class="question-name">{{ questionText }}</p>
    
          <div class="answers">
            <div
            class="answer-option"
            v-for="(answer, index) in answers"
            :key="index"
            :class="{ 'last-answer-option': index === answers.length - 1 }"
          >
          <div :class="{ 'option-index': true, 'option-correct': correctAnswer === index }">
            {{ String.fromCharCode(65 + index) }}
          </div>
          <p :class="{ 'option-correct': correctAnswer === index }">{{ answer.text }}</p>
          </div>
          </div>
        </div>
        <FooterQuestionUser />
      </div>
    </div>
  </div>

  <div v-if="showCropModalQuestion" class="modal-overlay">
    <div class="modal-content">
      <h2>クロップ画像</h2>
      <span class="modal-close" @click="closeCropModal('question')">×</span>
      <CropperComponent :imageUrl="uploadedQuestionImage" @cropped="handleCroppedImage('question',$event)" />
    </div>
  </div>
  
  <div v-if="showCropModalExplain" class="modal-overlay">
    <div class="modal-content">
      <h2>クロップ画像</h2>
      <span class="modal-close" @click="closeCropModal('explain')">×</span>
      <CropperComponent :imageUrl="uploadedExplainImage" @cropped="handleCroppedImage('explain',$event)" />
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watchEffect } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';
import pica from 'pica';
import QRCode from 'qrcode';

const props = defineProps({
  visible: Boolean,
});

// Add errors state
const errors = ref({
  questionNo: null,
  questionText: null,
  answers: {}
});

// Track active tab
let activeTab = ref('answers');

const emit = defineEmits(['cancel', 'create', 'preview']);

const questionNo = ref('');
const questionText = ref('');
const questionDescription = ref('');
const answers = ref([
  { text: '' , is_correct: true},
  { text: '' ,is_correct: false},
  { text: '' , is_correct: false},
  { text: '' , is_correct: false},
]);
const correctAnswer = ref(0);
const uploadedQuestionImage = ref(null);
const uploadedExplainImage = ref(null);
const imageQuestion = ref('');
const imageExplain = ref('');
let qrCodeBase64 = ref('');
let id = Math.floor(Date.now() / 1000); // Lấy Unix timestamp tính bằng giây
const answerLabels = ['A', 'B', 'C', 'D'];
const loading = ref(false);
const previewVisible = ref(false);
const showUpperModal = ref(props.visible);

const showCropModalQuestion = ref(false);
const showCropModalExplain = ref(false);
// Methods
const handleCroppedImage = async (type, croppedImage) => {
  // Chuyển đổi croppedImage thành base64
  const blob = await fetch(croppedImage).then(res => res.blob());
  const base64String = (await toBase64(blob)).replace(/^data:image\/[a-z]+;base64,/, '');
  
  if (type === 'question') {
    // Lưu base64 vào uploadedQuestionImage.value
    uploadedQuestionImage.value = croppedImage;
    // Lưu base64 vào imageQuestion.value
    imageQuestion.value = base64String;
    showCropModalQuestion.value = false;
  } else if (type === 'explain') {
    // Lưu base64 vào uploadedExplainImage.value
    uploadedExplainImage.value = croppedImage;
    // Lưu base64 vào imageExplain.value
    imageExplain.value = base64String;
    showCropModalExplain.value = false;
  }
};


const closeCropModal = (type) => {
  if (type === 'question') {
    showCropModalQuestion.value = false;
  } else if (type === 'explain') {
    showCropModalExplain.value = false;
  }
};


const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const onQuestionFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    // Kiểm tra kích thước file
    if (file.size > 1024 * 1024) {
      // Tạo một đối tượng ảnh từ file
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        // Tạo canvas để resize ảnh
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Đặt kích thước mới cho canvas
        const scaleFactor = Math.sqrt((1024 * 1024) / file.size);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        // Resize ảnh bằng pica
        const picaInstance = pica();
        await picaInstance.resize(img, canvas);
        
        // Chuyển đổi canvas thành base64
        canvas.toBlob(async (blob) => {
          const base64String = (await toBase64(blob)).replace(/^data:image\/[a-z]+;base64,/, '');
          imageQuestion.value = base64String;
          uploadedQuestionImage.value = URL.createObjectURL(blob);
          showCropModalQuestion.value = true;
        }, 'image/jpeg', 0.8); // Giảm chất lượng ảnh để giảm kích thước
      };
    } else {
      uploadedQuestionImage.value = URL.createObjectURL(file);
      imageQuestion.value = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
      showCropModalQuestion.value = true;
    }
  }
};


const onExplainFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    // Kiểm tra kích thước file
    if (file.size > 1024 * 1024) {
      // Tạo một đối tượng ảnh từ file
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        // Tạo canvas để resize ảnh
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Đặt kích thước mới cho canvas
        const scaleFactor = Math.sqrt((1024 * 1024) / file.size);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        // Resize ảnh bằng pica
        const picaInstance = pica();
        await picaInstance.resize(img, canvas);
        
        // Chuyển đổi canvas thành base64
        canvas.toBlob(async (blob) => {
          const base64String = (await toBase64(blob)).replace(/^data:image\/[a-z]+;base64,/, '');
          imageExplain.value = base64String;
          uploadedExplainImage.value = URL.createObjectURL(blob);
          showCropModalExplain.value = true;
        }, 'image/jpeg', 0.8); // Giảm chất lượng ảnh để giảm kích thước
      };
    } else {
      uploadedExplainImage.value = URL.createObjectURL(file);
      imageExplain.value = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
      showCropModalExplain.value = true;
    }
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
  resetErrors();
  // Reset all form fields
  questionNo.value = '';
  questionText.value = '';
  questionDescription.value = '';
  answers.value.forEach(answer => answer.text = '');
  correctAnswer.value = null;
  activeTab = ref('answers');
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

const hidden = () => {
  showUpperModal.value = false; // Hide upper modal
};

const preview = () => {
  previewVisible.value = true;
  hidden();
};

const closePreviewModal = () => {
  previewVisible.value = false;
  showUpperModal.value = true;
};

const validateForm = () => {
  let isValid = true;
  
  if (!questionNo.value) {
    errors.value.questionNo = '問No.が必要です';
    isValid = false;
  } else {
    errors.value.questionNo = null;
  }

  if (!questionText.value) {
    errors.value.questionText = '問題が必要です';
    isValid = false;
  } else {
    errors.value.questionText = null;
  }

  answers.value.forEach((answer, index) => {
    if (!answer.text) {
      errors.value.answers[index] = `回答 ${answerLabels[index]} が必要です`;
      isValid = false;
    } else {
      errors.value.answers[index] = null;
    }
  });

  return isValid;
};
const resetErrors = () => {
  errors.value = {
    questionNo: null,
    questionText: null,
    answers: {}
  };
};

const handleCreate = async () => {
  if (!validateForm()) {
    return;
  }
  NProgress.start();
  NProgress.set(0.4)
  if (loading.value) return;

  loading.value = true;
  await generateQRCode();
  // Prepare answers data
  const answersData = answers.value.map((answer, index) => ({
    id: index + id, // Use index as id for simplicity
    question_id: id,
    content: answer.text,
    is_correct: correctAnswer.value === index,
    created_user: 2662002, // Replace with actual user ID
  }));

  const newQuestion = {
    id,
    title: questionText.value,
    content: questionDescription.value.replace(/\n/g, '<br />'),
    qrcode: qrCodeBase64.value, // Placeholder for QR code
    sort: parseInt(questionNo.value, 10),
    image_question: imageQuestion.value,
    image_explain: imageExplain.value,
    created_user: 1 // Replace with actual user ID
  };

  id = Math.floor(Date.now() / 1000);
  
  try {
    // Make the POST requests to create question and answers concurrently
    const [questionResponse, answersResponse] = await Promise.all([
      axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions', newQuestion),
      axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/batchCreateItems', answersData)
    ]);
    // Emit event after successful creation
    emit('create', newQuestion, answersData);
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
const getFullImageUrl = (url) => {
  const prefix = "data:image/png;base64,";
  return prefix + url;
};

// Hàm chuyển đổi base64
const tobase64 = async (dataURL) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('Failed to convert to base64'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', dataURL);
    xhr.send();
  });
};

// Hàm tạo QR code
const generateQRCode = async () => {
  const domain = window.location.host;
  const qrCodeData = `https://${domain}/users/question?id=${id}`;
  try {
    // Tạo mã QR và chuyển đổi thành canvas
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, qrCodeData, { width: 230, height: 230, margin: 1 });

    // Thêm vòng tròn và văn bản vào giữa của canvas
    const ctx = canvas.getContext('2d');
    const circleRadius = 30; // Bán kính vòng tròn
    const circleX = canvas.width / 2;
    const circleY = canvas.height / 2;

    // Vẽ vòng tròn với màu gradient và viền
    const gradient = ctx.createRadialGradient(circleX, circleY, circleRadius / 2, circleX, circleY, circleRadius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'white');

    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Thêm văn bản vào giữa vòng tròn, căn chỉnh chính giữa
    ctx.font = 'bold 22px Verdana';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText('Q.' +questionNo.value, circleX, circleY + 2); // Điều chỉnh vị trí văn bản

    // Làm cho các thanh đen QR trông mịn màng và bo góc
    ctx.imageSmoothingEnabled = true;

    // Chuyển đổi canvas thành base64
    const base64 = canvas.toDataURL();
    qrCodeBase64.value = (await tobase64(base64));
    console.log(qrCodeBase64.value);
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Retry generating QR code
    setTimeout(() => generateQRCode(), 1000); // Retry after 1 second
  }
};

// Watch for changes in props.visible and update showUpperModal accordingly
watchEffect(() => {
  showUpperModal.value = props.visible;
  if (questionNo.value && errors.value.questionNo !== null) {
    errors.value.questionNo = null;
  }
  if (questionText.value && errors.value.questionText !== null) {
    errors.value.questionText = null;
  }
  answers.value.forEach((answer, index) => {
    if (answer.text && errors.value.answers[index] !== null) {
      errors.value.answers[index] = null;
    }
  });
});

onMounted(() => {
  // Set default value for correctAnswer when modal opens
  correctAnswer.value = 0; // Set the default correct answer index here
});
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
  height: 100%;
  min-height: 300px;
  max-height: 600px;
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
  width: 100%;
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
  width: 100%;
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
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Khi không có lỗi */
  margin: 2px 8px 0 8px;
}

.answer-row-temp input {
  scale: 1.5;
  margin-right: 4px;
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
  height: fit-content; /* Chiều cao 39px */
  min-height: 43px;
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


.modal-content-preview {
  height: 100%;
  background-color: #fefefe;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  width: 813px;

  max-height: 90vh; /* Đặt chiều cao tối đa của modal là 80% chiều cao của viewport */
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

.quiz-container {
  text-align: center;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  min-height: 100vh; /* Đảm bảo chiếm toàn bộ chiều cao của viewport */
  display: flex;
  flex-direction: column;

  
}

.quiz-navigation button {
  margin: 0.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1; 
}

.quiz-body img {
  width: 100%;
  height: auto;
}

.question-text {
  margin: 10px 0;
}

.question-text h2 {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #626263;
}

.question-name {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  margin: 12px 16px;
}

.answers {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.answer-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 78px;
  border-bottom: 1px solid #E3E4EC;
  position: relative;
}

.answer-option p {
  padding-left: 12px;
  margin-right: 16px;
  flex: 1;
  text-align: left;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  color: #4B4B4D;
}

.option-index {
  width: 40px;
  height: 40px;
  border: 2px solid #D6D6D6;
  background-color: white;
  color: #0082CA;
  border-radius: 50%;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}

.option-index.option-correct {
  color: red; /* Đổi màu chữ thành đỏ cho câu trả lời đúng */
}

p.option-correct {
  color: red; /* Đổi màu chữ thành đỏ cho câu trả lời đúng */
}

/* Loại bỏ border-bottom cho phần tử cuối cùng */
.last-answer-option {
  border-bottom: none;
}

.error-message {
  color: red;
  font-size: 12px;
}

</style>
