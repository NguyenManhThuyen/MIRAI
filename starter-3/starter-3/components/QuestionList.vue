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
      :questionIndex="index"
      :style="{ marginBottom: '12px' }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const questions = ref([]);
const questionsFloor = ref([]);

const router = useRouter();

const fetchQuestionsFromAPI = async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    
    questions.value = response.data.map(question => ({
      id: question.id,
      question_name: question.question_name,
      floor: question.floor
    }));

        // Extract and save the floor values
        questionsFloor.value = questions.value.map(question => question.floor);
    localStorage.setItem("questionsFloor", questionsFloor.value);


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

const handleDelete = async (id) => {
  try {
    await axios.delete(
      `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id}`
    );

    // Filter out the deleted question from the local list
    questions.value = questions.value.filter(question => question.id !== id);

    // Update the questions list with new data
    await fetchQuestionsFromAPI();
  } catch (error) {
    console.error('Error deleting question:', error);
    // Handle error when deleting question fails
  }
};

// Fetch initial questions data when component is mounted
onMounted(fetchQuestionsFromAPI);


</script>

<style scoped>
/* Scrollbar styles */
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
