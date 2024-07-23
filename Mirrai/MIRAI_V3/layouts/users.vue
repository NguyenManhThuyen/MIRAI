<template>
    <div class="quiz-container">
      <HeaderQuestionUser />
      <NuxtPage />
      <FooterQuestionUser />
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
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
  </style>
  