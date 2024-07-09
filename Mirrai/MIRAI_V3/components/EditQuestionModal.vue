<template>
  <div class="modal" v-if="visible" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">x</span>
      <h2>{{ `問${sort}編集` }}</h2>
      <div class="question-details">
        <div class="left-column">
          <img :src="qrcode" alt="QR Code Image" class="qrcode-image" />
        </div>
        <div class="right-column">
          <button @click="downloadQRCode" class="download-button">ダウンロード</button>
          <div class="sub-right-column">
            <input type="text" :value="downloadUrl" class="modal-input" readonly ref="inputToCopy" />
            <img src="@/assets/images/copy-icon.svg" alt="Icon" class="modal-input-icon" @click="copyInputValue" />
          </div>
        </div>
      </div>
      <div class="question-content">
        <template v-if="uploadedQuestionImage">
          <img :src="uploadedQuestionImage" alt="Uploaded Question Image" class="uploaded-image" @click="handleQuestionImageClick" />
        </template>
        <div class="button-container">
          <button @click="triggerFileQuestionInput" class="change-image-button">画像変更</button>
          <input type="file" ref="fileQuestionInput" @change="handleFileQuestionChange" style="display: none;" />
        </div>
      </div>
      <div class="form-group">
        <label for="questionNo">問No.</label>
        <input id="questionNo" type="text" v-model="question.sort" />
      </div>
      <div class="form-group">
        <label for="questionText">質問</label>
        <textarea id="questionText" v-model="question.title"></textarea>
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
          <div class="answer-row-temp">
            <input type="radio" :value="index" v-model="correctAnswer" @change="setCorrectAnswer(index)" />
            <label :class="{'label-answer': true, 'correct': answer.is_correct}">正答に設定</label>
          </div>
        </div>        
      </div>
      
      

      <div v-else-if="activeTab === 'description'" class="tab-content">
        <div class="image-upload">
          <template v-if="uploadedExplainImage">
            <div class="question-content">
              <template v-if="uploadedExplainImage">
                <img :src="uploadedExplainImage" alt="Uploaded Question Image" class="uploaded-image" @click="handleExplainImageClick" />
              </template>
              <div class="button-container">
                <button @click="triggerFileExplainInput" class="change-image-button">画像変更</button>
                <input type="file" ref="fileExplainInput" @change="handleFileExplainChange" style="display: none;" />
              </div>
            </div>
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
          <textarea id="questionDescription" v-model="question.content"></textarea>
        </div>
      </div>

      <div class="actions">
        <button @click="preview">プレビュー</button>
        <button @click="cancel">キャンセル</button>
        <button :disabled="loading" @click="handleSave">作成</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { defineProps, ref, watchEffect, computed } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';

const props = defineProps({
  visible: Boolean,
  questionId: Number,
});

const answerLabels = ['A', 'B', 'C', 'D'];
const question = ref({});
const answers = ref([]);
const uploadedQuestionImage = ref('');
const uploadedExplainImage = ref('');
const sort = ref();
const qrcode = ref('');
let activeTab = ref('answers');
const correctAnswer = ref(null);
const emit = defineEmits(['cancel', 'save', 'preview']);
const loading = ref(false);

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


watchEffect(() => {
  if (props.visible) {
    fetchQuestionData();
  }
});

const closeModal = () => {
  emit('cancel');
  uploadedQuestionImage.value = null;
  uploadedExplainImage.value = null;
};

const handleFileQuestionChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadedQuestionImage.value = URL.createObjectURL(file);
    question.value.image_question = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
  }
};

const handleFileExplainChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadedExplainImage.value = URL.createObjectURL(file);
    question.value.image_explain = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
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

const downloadUrl = computed(() => question.value ? `http://192.168.11.199:3000/users/question?id=${question.value.id}` : '');

const handleSave = async () => {
  try {
    NProgress.start()
    NProgress.set(0.4)
    loading.value = true;

    // Parse sort to integer
    const sortInt = parseInt(question.value.sort, 10); // 10 là radix

    // Prepare question data for update
    const questionData = {
      id: question.value.id, // Assuming each question has an ID for identification
      sort: sortInt,
      title: question.value.title,
      content: question.value.content,
      qrcode: question.value.qrcode,
      image_explain: question.value.image_explain,
      image_question: question.value.image_question,
      updated_user: 123456
    };
    console.log("thuyen",questionData);
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

    console.log("thuyen1", answersData);

    // Update answers via API
    await axios.put(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/batchUpdateItems`, answersData);

    // Emit save event
    emit('save');

    // Reset loading state
    loading.value = false;
    NProgress.done();
  } catch (error) {
    console.error('Error saving question:', error);
    loading.value = false;
    NProgress.done();
  }
};

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

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
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

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
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
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  cursor: pointer;
}

.uploaded-image:hover {
  opacity: 0.8;
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
  display: flex; /* Sử dụng flexbox để các phần tử con nằm cùng 1 hàng */
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
  justify-content: right;
  margin: 2px 8px 0 8px;
}

.answer-row input[type="radio"] {
  margin-right: 10px;
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
