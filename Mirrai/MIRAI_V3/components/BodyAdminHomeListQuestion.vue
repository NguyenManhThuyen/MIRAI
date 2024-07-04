<template>
    <div class="question-list">
      <div class="header">
        <h2>トピックの質問:</h2>
        <button @click="createNewQuestion" class="create-button">
          <p class="icon">+</p>
          <p class="title">新規作成</p>
        </button>
      </div>
      <div class="questions">
        <div
          v-for="(question, index) in questions"
          :key="question.ID"
          :class="{ 'no-border': index === questions.length - 1 }"
          class="question-row"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="question-image">
            <img :src="question.questionUrl" alt="Question Image" />
          </div>
          <div class="question-text">{{ question.questionName }}</div>
          <div class="actions">
            <div class="action-image">
              <img :src="question.qrcodeUrl" alt="Action Image" />
            </div>
            <div class="divider"></div> <!-- Thêm phần này để làm thanh ngăn cách -->
            <div class="edit">
              <img src="@/assets/images/admin-home-edit-question-icon.svg" alt="Edit" @click="editQuestion(question.ID)" />
            </div>
            <div class="delete">
              <img src="@/assets/images/admin-home-delete-question-icon.svg" alt="Delete" @click="deleteQuestion(question.ID)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const questions = ref([]);

const fetchQuestions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8081/questions');
    questions.value = response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

const createNewQuestion = () => {
  // Logic to create a new question
};

const editQuestion = (id) => {
  // Logic to edit a question
};

const deleteQuestion = (id) => {
  // Logic to delete a question
};

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

.question-text{
    font-family: Noto Sans JP;
    font-size: 20px;
    font-weight: 400;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #4B4B4D;
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
}
</style>
