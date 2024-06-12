<template>
  <div>
    <Question
      v-for="(question, index) in questions"
      :key="index"
      :id="question.id"
      :questionText="question.question_name"
      :floor="question.floor"
      @delete="handleDelete"
      :isLastQuestion="index === questions.length - 1"
      @addNewQuestion="addNewQuestion"
      :questionIndex="index"
      :style="{ marginBottom: '12px' }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Question from './Question.vue';
import axios from 'axios';

const questions = ref([]);

const fetchQuestionsFromAPI = async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    questions.value = response.data.map(question => ({
      id: question.id,
      question_name: question.question_name,
      floor: question.floor
    }));
    // Thêm dòng câu hỏi mới "+ さらに質問を" vào cuối danh sách
    questions.value.push({ id: questions.value.length + 1, question_name: '+ さらに質問を', floor: null });
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Xử lý lỗi khi gọi API thất bại
  }
};

// Gọi hàm fetchQuestionsFromAPI khi component được mounted
fetchQuestionsFromAPI();

const handleDelete = (id) => {
  questions.value = questions.value.filter(question => question.id !== id);
};

const addNewQuestion = () => {
  const lastQuestion = questions.value[questions.value.length - 1];
  const newId = lastQuestion.id + 1;
  const newQuestionquestion_name = `質問番号 ${newId}`;
  
  // Cập nhật nội dung của câu hỏi thứ 10 thành "質問番号 10"
  questions.value[questions.value.length - 1].question_name = `質問番号 ${lastQuestion.id}`;

  // Thêm câu hỏi mới với nội dung "+ さらに質問を"
  questions.value.push({ id: newId, question_name: '+ さらに質問を', floor: null });
};
</script>


<style scoped>
/* Add any required styles here */

/* For small devices such as phones */
@media (max-width: 576px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}

/* For medium devices such as tablets */
@media (min-width: 577px) and (max-width: 768px) {
  .question-component {
    width: 90%; /* Set width to 90% for smaller width */
  }
}

/* For large devices such as laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  .question-component {
    width: 90%; /* Set width to 70% for medium width */
  }
}

/* For extra small devices such as small phones */
@media (max-width: 425px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}
</style>
