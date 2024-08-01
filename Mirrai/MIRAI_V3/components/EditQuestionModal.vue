<template>
  <div class="modal" v-if="showUpperModal" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">×</span>
      <h2>{{ `問${sort}編集` }}</h2>
      <div class="question-details">
        <div class="left-column">
          <img  v-if="qrcode" :src="qrcode" class="qrcode-image" />
        </div>
        <div class="right-column">
          <button @click="downloadQRCode" class="download-button">ダウンロード</button>
          <div class="sub-right-column">
            <input type="text" :value="downloadUrl" class="modal-input" readonly ref="inputToCopy" />
            <img src="@/assets/images/copy-icon.svg"  class="modal-input-icon" @click="copyInputValue" />
          </div>
        </div>
      </div>
      <div class="question-content">
        <template v-if="uploadedQuestionImage">
          <img :src="uploadedQuestionImage" class="uploaded-image" @click="handleQuestionImageClick" />
        </template>
        <div class="button-container">
          <button @click="triggerFileQuestionInput" class="change-image-button">画像変更</button>
          <input type="file" ref="fileQuestionInput" @change="handleFileQuestionChange" style="display: none;" />
        </div>
      </div>
      <div class="form-group">
        <label for="questionNo">問No.</label>
        <input id="questionNo" type="text" v-model="question.sort" />
        <p v-if="errors.questionNo" class="error-message">{{ errors.questionNo }}</p>
      </div>
      <div class="form-group">
        <label for="questionText">問題</label>
        <textarea id="questionText" v-model="question.title" style="resize: none;"></textarea>
        <p v-if="errors.questionText" class="error-message">{{ errors.questionText }}</p>
      </div>

      <div class="tab-buttons">
        <button :class="{ active: activeTab === 'answers' }" @click="activeTab = 'answers'">回答</button>
        <button :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">説明</button>
      </div>

      <div v-if="activeTab === 'answers'" class="answers">
        <div v-for="(answer, index) in answers" :key="index" class="answer">
          <div class="answer-row">
            <div :class="{'label-index': true, 'correct': answer.is_correct}">
              {{ answerLabels[index] }}
            </div>
            <input type="text" v-model="answers[index].content" :class="{'correct': answer.is_correct}" />
          </div>
          <div class="answer-row-temp" :style="{ justifyContent: errors.answers[index] ? 'space-between' : 'flex-end' }">
            <p v-if="errors.answers[index]" class="error-message">{{ errors.answers[index] }}</p>
            <div>
              <input type="radio" :value="index" v-model="correctAnswer" @change="setCorrectAnswer(index)" />
              <label :class="{'label-answer': true, 'correct': answer.is_correct}">正答に設定</label>
            </div>
          </div>
        </div>        
      </div>
      
      

      <div v-else-if="activeTab === 'description'" class="tab-content">
        <div class="image-upload">
          <template v-if="uploadedExplainImage">
            <div class="question-content">
              <template v-if="uploadedExplainImage">
                <img :src="uploadedExplainImage"  class="uploaded-image" @click="handleExplainImageClick" />
              </template>
              <div class="button-container">
                <button @click="triggerFileExplainInput" class="change-image-button">画像変更</button>
                <input type="file" ref="fileExplainInput" @change="handleFileExplainChange" style="display: none;" />
              </div>
            </div>
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
          <textarea id="questionDescription" v-model="formattedContent" style="resize: none;"></textarea>
        </div>
      </div>

      <div class="actions">
        <button @click="preview">プレビュー</button>
        <button @click="closeModal">キャンセル</button>
        <button :disabled="loading" @click="handleSave">作成</button>
      </div>
    </div>
  </div>

  <div class="modal" v-if="previewVisible" @click.self="closePreviewModal">
    <div class="modal-content-preview">
      <div class="quiz-container">
        <HeaderQuestionUser />
        <HeaderStampQuestionUser />
        <div class="quiz-body">
          <img v-if="uploadedQuestionImage" :src="uploadedQuestionImage" alt="Question Image" />
          <div class="question-text">
            <h2>問題{{question.sort}}:</h2>
          </div>
          <p class="question-name">{{ question.title }}</p>
    
          <div class="answers">
            <div
            class="answer-option"
            v-for="(answer, index) in answers"
            :key="index"
            :class="{ 'last-answer-option': index === answers.length - 1 }"
          >
            <div :class="{ 'option-index': true, 'option-correct': answer.is_correct }">{{ String.fromCharCode(65 + index) }}</div>
            <p :class="{ 'option-correct': answer.is_correct }">{{ answer.content }}</p>
          </div>
          </div>
        </div>
        <FooterQuestionUser :disableLink="true"/>
      </div>
    </div>
  </div>

  <div v-if="showCropModalQuestion" class="modal-overlay" @click.self="closeCropModal('question')">
    <div class="modal-content">
      <h2>クロップ画像</h2>
      <span class="close" @click="closeCropModal('question')">×</span>
      <CropperComponent :imageUrl="uploadedQuestionImagee" @cropped="handleCroppedImage('question',$event)" />
    </div>
  </div>
  
  <div v-if="showCropModalExplain" class="modal-overlay" @click.self="closeCropModal('explain')">
    <div class="modal-content">
      <h2>クロップ画像</h2>
      <span class="close" @click="closeCropModal('explain')">×</span>
      <CropperComponent :imageUrl="uploadedExplainImagee" @cropped="handleCroppedImage('explain',$event)" />
    </div>
  </div>
  
</template>



<script setup>
import { defineProps, ref, watchEffect, computed } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';
import pica from 'pica';

const props = defineProps({
  visible: Boolean,
  questionId: Number,
});

// Add errors state
const errors = ref({
  questionNo: null,
  questionText: null,
  answers: {}
});


const answerLabels = ['A', 'B', 'C', 'D'];
const question = ref({});
const answers = ref([]);
const uploadedQuestionImage = ref('');
const uploadedExplainImage = ref('');
const uploadedQuestionImagee = ref('');
const uploadedExplainImagee = ref('');
const sort = ref();
const qrcode = ref('');
let activeTab = ref('answers');
const correctAnswer = ref(null);
const emit = defineEmits(['cancel', 'save', 'preview']);
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
    question.value.image_question = base64String;    
    showCropModalQuestion.value = false;
  } else if (type === 'explain') {
    // Lưu base64 vào uploadedExplainImage.value
    uploadedExplainImage.value = croppedImage;
    // Lưu base64 vào imageExplain.value
    question.value.image_explain = base64String;
    showCropModalExplain.value = false;
  }
};

const closeCropModal = (type) => {
  if (type === 'question') {
    showCropModalQuestion.value = false;
  } else if (type === 'explain') {
    showCropModalExplain.value = false;
  }
  // Reset the input file elements themselves
  const fileInputs = document.querySelectorAll('.image-upload input[type="file"]');
  fileInputs.forEach(fileInput => {
    fileInput.value = ''; // Clear the selected file in the input
  });
};

const fetchQuestionData = async () => {
  try {
    const [questionResponse, answersResponse] = await Promise.all([
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${props.questionId}`),
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/${props.questionId}`)
    ]);

    question.value = questionResponse.data;
    uploadedQuestionImage.value = getFullImageUrl(question.value.image_question);
    uploadedExplainImage.value = getFullImageUrl(question.value.image_explain);
    sort.value = question.value.sort;
    qrcode.value = question.value.qrcode;

    answers.value = answersResponse.data;
    // Find the index of the correct answer
    const correctIndex = answers.value.findIndex(answer => answer.is_correct);
    if (correctIndex !== -1) {
      correctAnswer.value = correctIndex;
    }
  } catch (error) {
    console.error('Error fetching question data:', error);
  }
};

const formattedContent = computed({
  get() {
    return question.value.content ? question.value.content.replace(/<br\s*[/]?>/gi, '\n') : '';
  },
  set(newValue) {
    question.value.content = newValue.replace(/\n/g, '<br>');
  }
});

// Watch để cập nhật `question.value.content` mỗi khi `formattedContent` thay đổi
watch(formattedContent, (newVal, oldVal) => {
  question.value.content = newVal.replace(/\n/g, '<br>');
});

const resetErrors = () => {
  errors.value = {
    questionNo: null,
    questionText: null,
    answers: {}
  };
};

watch(() => props.visible, async (newValue, oldValue) => {
  if (newValue) {
    // Only fetch data if modal becomes visible
    await fetchQuestionData();
  } else {
    // Reset errors and clear data when modal is hidden
    resetErrors();
    question.value = {};
    answers.value = [];
    uploadedQuestionImage.value = '';
    uploadedExplainImage.value = '';
    uploadedQuestionImagee.value = '';
    uploadedExplainImagee.value = '';
    sort.value = null;
    qrcode.value = '';
    activeTab.value = 'answers'; // Reset activeTab to 'answers'
    correctAnswer.value = null; // Reset correctAnswer
  }
  showUpperModal.value = newValue;
});


const closeModal = () => {
  resetErrors();
  emit('cancel');
  uploadedQuestionImage.value = null;
  uploadedExplainImage.value = null;
  uploadedQuestionImagee.value = null;
  uploadedExplainImagee.value = null;
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

const handleFileQuestionChange = async (event) => {
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
          question.value.image_question = base64String;
          showCropModalQuestion.value = true;
          uploadedQuestionImagee.value = URL.createObjectURL(file);
        }, 'image/jpeg', 0.8); // Giảm chất lượng ảnh để giảm kích thước
      };
    } else {
      question.value.image_question = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
      showCropModalQuestion.value = true;
      uploadedQuestionImagee.value = URL.createObjectURL(file);
    }
  }
};

const handleFileExplainChange = async (event) => {
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
          question.value.image_explain = base64String;
          showCropModalExplain.value = true;
        }, 'image/jpeg', 0.8); // Giảm chất lượng ảnh để giảm kích thước
        uploadedExplainImagee.value = URL.createObjectURL(file);
      };
    } else {
      question.value.image_explain = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
      showCropModalExplain.value = true;
      uploadedExplainImagee.value = URL.createObjectURL(file);
    }
  }
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

const triggerFileQuestionInput = () => {
  document.querySelector('input[type="file"]').click();
};

const triggerFileExplainInput = () => {
  document.querySelector('input[type="file"]').click();
};


const handleQuestionImageClick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', handleFileQuestionChange);
  fileInput.click();
};

const handleExplainImageClick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', handleFileExplainChange);
  fileInput.click();
};

const downloadQRCode = () => {
  const link = document.createElement('a');
  link.href = question.value.qrcode;
  link.download = 'qrcode.png';
  link.click();
};

const inputToCopy = ref(null);
const copyInputValue = () => {
  const inputElement = unref(inputToCopy);
  if (inputElement) {
    inputElement.select();
    document.execCommand('copy');
  }
};


const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};

const setCorrectAnswer = (index) => {
  answers.value.forEach((answer, i) => {
    if (i === index) {
      answer.is_correct = true;
    } else {
      answer.is_correct = false;
    }
  });
};
const domain = window.location.host;
const downloadUrl = computed(() => question.value ? `https://${domain}/users/question?id=${question.value.id}` : '');

const validateForm = () => {
  let isValid = true;
  
  if (!question.value.sort) {
    errors.value.questionNo = '問No.が必要です';
    isValid = false;
  } else {
    errors.value.questionNo = null;
  }

  if (!question.value.title) {
    errors.value.questionText = '問題が必要です';
    isValid = false;
  } else {
    errors.value.questionText = null;
  }

  answers.value.forEach((answer, index) => {
    if (!answer.content) { // Change from answer.text to answer.content
      errors.value.answers[index] = `回答 ${answerLabels[index]} が必要です`;
      isValid = false;
    } else {
      errors.value.answers[index] = null;
    }
  });
  return isValid;
};

const handleSave = async () => {
  if (!validateForm()) {
    return;
  }
  NProgress.start()
  NProgress.set(0.4)
  try {
    loading.value = true;

    // Parse sort to integer
    const sortInt = parseInt(question.value.sort, 10); // 10 là radix

    // Prepare question data for update
    const questionData = {
      id: question.value.id, // Assuming each question has an ID for identification
      sort: sortInt,
      title: question.value.title,
      qrcode: question.value.qrcode,
      image_explain: question.value.image_explain,
      image_question: question.value.image_question,
      updated_user: 123456,
      content: question.value.content.replace(/\n/g, '<br />')
    };
    // Update question via API
    await axios.put(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions`, questionData);

    // Prepare answers data for update
    const answersData = answers.value.map((answer, index) => ({
      id: answer.id, // Assuming each answer has an ID for identification
      question_id: answer.question_id,
      content: answer.content,
      is_correct: index === correctAnswer.value,
      created_user: 123456
    }));
    // Update answers via API
    await axios.put(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/batchUpdateItems`, answersData);

    // Emit save event
    emit('save');

    // Reset loading state
    loading.value = false;
  } catch (error) {
    console.error('Error saving question:', error);
    loading.value = false;
  } finally {
    NProgress.done();
  }
};


watchEffect(() => {
  // Watch for changes in questionNo and questionText inputs
  if (errors.value.questionNo && question.value.sort) {
    errors.value.questionNo = null;
  }
  if (errors.value.questionText && question.value.title) {
    errors.value.questionText = null;
  }
  answers.value.forEach((answer, index) => {
    if (errors.value.answers[index] && answer.content) {
      errors.value.answers[index] = null;
    }
  })
});

</script>



<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
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
  margin: 0 12px;
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
  margin-bottom: 12px;
  font-weight: bold; /* Độ đậm của font */
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  color: #000;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.question-details {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}

.left-column {
  flex: none;
}

.qrcode-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.right-column {
  flex: 1;
  margin-left: 10px;
}

.sub-right-column {
  display: flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  max-width: 500px;
  min-height: 48px;
  background-color: #F1F4F9;
}

.download-button {
  color: #2E7CF6;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
}

.question-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.change-image-button {
  background-color: transparent;
  color: #2E7CF6;
  border: none;
  border-radius: 4px;
  height: 20px;
  cursor: pointer;
}

.modal-input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  margin-left: 4px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  text-align: left;
  color: #97979F;
  border: none;
  background-color: transparent;
  max-width: 400px;
  outline: none;
  white-space: nowrap; /* Ngăn không cho dòng bị wrap */
  overflow: hidden; /* Ẩn nội dung bị tràn */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi bị cắt */
}

.modal-input-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  margin-left: 4px;
  margin-right: 12px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  min-height: 300px;
  max-height: 600px;
  object-fit: contain;
  border-radius: 12px;
  cursor: pointer;
}


.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
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

.tab-content {
  padding: 0 33px 20px 33px;
  gap: 30
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

.label-index.correct {
  border-color: #FF6347; /* Màu đỏ */
  color: #FF6347; /* Màu chữ đỏ */
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
.answer-row input[type="text"].correct {
  border-color: #FF6347; /* Màu đỏ */
  color: #FF6347; /* Màu chữ đỏ */
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

.label-answer.correct {
  color: #2E7CF6; /* Ví dụ: màu chữ xanh lá cây */
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
  background-color: #fefefe;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 813px;

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

/* Responsive từ 768px trở lên */
@media screen and (max-width: 768px) {
  .modal-content {
    padding: 24px;
  }
  .question-details {
    margin-top: 12px;
  }
  .question-content {
    padding-bottom: 8px;
  }
  .form-group input {
    max-width: 100px;
  }
  .uploaded-image {
    min-height: 0;
  }
  .form-group textarea#questionDescription {
    min-height: 150px;
  }
}
/* Responsive từ 576px trở lên */
@media screen and (max-width: 576px) {

}

/* Responsive từ 480px trở lên */
@media screen and (max-width: 480px) {

}

@media screen and (max-width: 420px) {
  .modal-content {
    padding: 24px 16px;
  }
  .actions button {
    width: 95px;
    font-size: 14px;
  }
}

/* Responsive từ 320px trở lên */
@media screen and (max-width: 320px) {
  .modal-content {
    padding: 24px 12px;
  }
}
</style>
