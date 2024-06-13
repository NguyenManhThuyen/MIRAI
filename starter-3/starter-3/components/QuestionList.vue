<template>
  <div class="scroll-container">
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
import { ref, onMounted, watch } from 'vue';
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
    // Add new question "+ さらに質問を" at the end of the list
    questions.value.push({ id: questions.value.length + 1, question_name: '+ さらに質問を', floor: null });
    // Sort questions by floor in ascending order
    sortQuestionsByFloor();
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Handle error when calling API fails
  }
};

const sortQuestionsByFloor = () => {
  questions.value.sort((a, b) => (a.floor === null ? Infinity : a.floor) - (b.floor === null ? Infinity : b.floor));
};

// Call fetchQuestionsFromAPI when the component is mounted
onMounted(() => {
  fetchQuestionsFromAPI();
});

const handleDelete = async (id) => {
  try {
    await axios.delete(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id}`);
    await fetchQuestionsFromAPI();
  } catch (error) {
    console.error('Error deleting question:', error);
  }
};

const addNewQuestion = () => {
  // Find the maximum floor value
  const maxFloor = questions.value.reduce((max, question) => {
    return question.floor !== null && question.floor > max ? question.floor : max;
  }, -Infinity);

  // Add new question "+ さらに質問を" at the end of the list with the next floor number
  const newQuestionFloor = maxFloor !== -Infinity ? maxFloor + 1 : 1;
  questions.value.push({ id: questions.value.length + 1, question_name: '質問番号' + questions.value.length, floor: questions.value.length });

  // Sort questions by floor in ascending order
  sortQuestionsByFloor();
};

// Optional: Use watch to react to changes in the questions array
watch(questions, (newQuestions, oldQuestions) => {
  console.log('Questions updated:', newQuestions);
});
</script>


<style scoped>
/* Scrollbar styles */
.scroll-container {
  max-height: calc(100dvh - 200px); /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */
  padding-right: 8px; /* Adjust padding to avoid content being covered by scrollbar */
}

/* Add any other necessary styles here */

/* For small devices such as phones */
@media (max-width: 576px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}

/* For medium devices such as tablets */
@media (min-width: 577px) and (max-width: 768px) {
  .question-component {
    width: 100%; /* Set width to 100% for smaller width */
  }
}

/* For large devices such as laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  .question-component {
    width: 100%; /* Set width to 100% for medium width */
  }
}

/* For extra small devices such as small phones */
@media (max-width: 425px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}
</style>
