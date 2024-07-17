<template>
  <div class="question-list">
    <div class="header">
      <h2>トピックの質問:</h2>
      <button @click="showCreateModal" class="create-button">
        <p class="icon">+</p>
        <p class="title">新規作成</p>
      </button>
    </div>
    <div class="questions">
      <div
        v-for="(question, index) in questions"
        :key="question.id"
        :class="{ 'no-border': index === questions.length - 1 }"
        class="question-row"
      >
        <div class="index">{{ index + 1 }}</div>
        <div class="question-image">
          <img  v-if="question.image_question" :src="getFullImageUrl(question.image_question)"  />
        </div>
        <div class="question-text">{{ question.title }}</div>
        <div class="actions">
          <div class="action-image">
            <img  v-if="question.qrcode" :src="question.qrcode"  />
          </div>
          <div class="divider"></div> <!-- Thêm phần này để làm thanh ngăn cách -->
          <div class="edit">
            <img src="@/assets/images/admin-home-edit-question-icon.svg"  @click="showEditModal(question.id)" />
          </div>
          <div class="delete">
            <img src="@/assets/images/admin-home-delete-question-icon.svg"  @click="confirmDelete(question.id, index+1)" />
          </div>
        </div>
      </div>
    </div>
    <AlertComponent
      :title="alertTitle"
      :content="alertContent"
      :actionText="alertActionText"
      :visible="alertVisible"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
    <CreateQuestionModal
      :visible="createModalVisible"
      @cancel="createModalVisible = false"
      @create="handleCreate"
    />
    <CreateQuestionSuccessModal
      :visible="createSuccessModalVisible"
      :newQuestion="successModalNewQuestion"
      :answersResponse="successModalAnswersResponse"
      @close="createSuccessModalVisible = false"
    />
    <EditQuestionModal
      :visible="editModalVisible"
      :questionId="editModalQuestionId"
      @cancel="editModalVisible = false"
      @save="handleSaveEdit"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef, watchEffect } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';
import { toast } from 'vue3-toastify';

const questions = ref([]);
const alertTitle = ref('削除の確認');
const alertContent = ref('');
const alertActionText = ref('Delete');
const alertVisible = ref(false);
const currentQuestionId = ref(null);
const createModalVisible = ref(false);
const successModalNewQuestion = shallowRef(null);
const successModalAnswersResponse = shallowRef(null);
const createSuccessModalVisible = ref(false); // Add this line to define createSuccessModalVisible

const editModalVisible = ref(false);
const editModalQuestionId = ref(null);

const showEditModal = (questionId) => {
  editModalQuestionId.value = questionId;
  editModalVisible.value = true;
};

// Xử lý khi lưu chỉnh sửa
const handleSaveEdit = (editedQuestion) => {
  // Logic để lưu câu hỏi chỉnh sửa
  editModalVisible.value = false;
  toast.success("問題は正常に編集されました");
  fetchQuestions(); // Gọi lại hàm fetch để cập nhật danh sách câu hỏi
};

const fetchQuestions = async () => {
  try {
    NProgress.start()
    NProgress.set(0.4)
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    questions.value = response.data;
    NProgress.done();
  } catch (error) {
    NProgress.done();
  }
};

const confirmDelete = (id, index) => {
  currentQuestionId.value = id;
  alertContent.value = `問題番号 ${index} を削除しますか?`;
  alertVisible.value = true;
};

const handleCancel = () => {
  alertVisible.value = false;
};

const handleCreate = (newQuestion, answersResponse) => {
  // Logic to handle creating a new question
  successModalNewQuestion.value = newQuestion;
  successModalAnswersResponse.value = answersResponse;

  createModalVisible.value = false;
  toast.success("問題が正常に作成されました");
  // Show success modal
  createSuccessModalVisible.value = true;
  fetchQuestions();
};


const handleConfirm = async () => {
  try {
    NProgress.start();
    await axios.delete(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${currentQuestionId.value}`);
    alertVisible.value = false;
    fetchQuestions(); // Load lại danh sách câu hỏi
    NProgress.done();
    await axios.delete(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/${currentQuestionId.value}`);
  } catch (error) {
    NProgress.done();
    toast.success("問題は正常に削除されました");
  }
};

const showCreateModal = () => {
  createModalVisible.value = true;
};

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/"; // Thay bằng chuỗi bạn muốn nối thêm
  return prefix + url;
};

// Watch effect to fetch questions initially and on data change
watchEffect(async () => {
  try {
    NProgress.start();
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    questions.value = response.data;
    NProgress.done();
  } catch (error) {
    NProgress.done();
    console.error('Error fetching questions:', error);
  }
});

onMounted(fetchQuestions);
</script>

<style scoped>
.question-list {
  margin-top: 10px;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  text-align: center;
  color: #6a6a6a;
}

.create-button {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  width: fit-content;
  height: 48px;
  padding: 8px;
  gap: 4px;
  border-radius: 8px;
  opacity: 1;
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}

.create-button .icon {
  width: 24px;
  height: 24px;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
}

.create-button .title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
}

.create-button:hover {
  transform: scale(1.1); /* Phóng to khi di chuột vào */
}

.create-button:active {
  transform: scale(1); /* Thu nhỏ lại khi nhấn nút */
}

.questions {
  width: 100%;
}

.question-row {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #E3E4EC;
  min-height : 100px;
  height: fit-content;
}

.question-row.no-border {
  border-bottom: none;
}

.index,
.question-image,
.question-text {
  margin-right: 10px;
}

.index {
    font-family: Noto Sans JP;
    font-size: 20px;
    font-weight: 400;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #4B4B4D;
}

.question-text {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 400;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}

.question-image img {
  width: 90px;
  height: 67px;
  object-fit: cover;
  border-radius: 8px;
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.divider {
    height: 37px; /* Chiều cao của thanh ngăn cách */
    width: 1px; /* Độ dài của thanh ngăn cách */
    background-color: #ccc; /* Màu sắc của thanh ngăn cách */
    margin-left: 10px; /* Khoảng cách với các phần tử khác */
  }

.action-image img{
    width: 48px;
    height: 48px;
    margin-left: 10px;
}

.edit img,
.delete img {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}


.edit img:hover,
.delete img:hover {
  transform: scale(1.17); /* Phóng to khi di chuột vào */
}

.edit img:active,
.delete img:active {
  transform: scale(1); /* Phóng to khi di chuột vào */
}

@media (max-width: 480px) {
  .action-image,
  .divider {
    display: none; /* Ẩn QR và thanh xám khi màn hình nhỏ hơn 480px */
  }

  .question-text {
    font-size: 16px;
    font-weight: 300;
    line-height: 22.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #4b4b4d;
    max-height: 150px; /* Giới hạn chiều cao của question-text */
    overflow: hidden; /* Ẩn nội dung bị tràn */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Số dòng tối đa */
            line-clamp: 3; /* Số dòng tối đa */
    -webkit-box-orient: vertical;
  }

  .question-image img {
    display: none; /* Ẩn hình ảnh trong question-image */
  }
  
}

</style>
