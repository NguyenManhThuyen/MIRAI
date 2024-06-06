<!-- components/questionList.vue -->
<template>
    <div>
      <Question
        v-for="question in questions"
        :key="question.id"
        :id="question.id"
        :questionText="question.text"
        :floor="question.floor"
        @delete="handleDelete"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Question from './Question.vue';
  
  const questions = ref([
    { id: 1, text: 'Appleが最初に発売した製品は何ですか?', floor: 1 },
    { id: 2, text: '着物を着る文化的伝統がある国はどこですか?', floor: 5 },
    { id: 3, text: '着物を着る文化的伝統がある国はどこですか?', floor: 7 },
    { id: 4, text: '着物を着る文化的伝統がある国はどこですか?', floor: 9 },
    { id: 5, text: '着物を着る文化的伝統がある国はどこですか?', floor: 10 },
    { id: 6, text: '質問番号6', floor: null },
    { id: 7, text: '質問番号7', floor: null },
    { id: 8, text: '質問番号8', floor: null },
    { id: 9, text: '質問番号9', floor: null },
    { id: 10, text: '+ さらに質問を', floor: null },
  ]);
  
  const handleDelete = (id) => {
    questions.value = questions.value.filter(question => question.id !== id);
  };
  </script>
  
  <style scoped>
  /* Add any required styles here */
  </style>
  