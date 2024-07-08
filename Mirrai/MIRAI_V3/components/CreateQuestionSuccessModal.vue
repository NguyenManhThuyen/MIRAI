<template>
    <div class="modal-overlay" v-if="visible">
      <div class="modal-container">
        <h2>{{ title }}</h2>
        <div class="modal-content">
          <img :src="getFullImageUrl(newQuestion.image_question)" alt="Question Image" class="modal-image" />
          <div class="text-section">
            <p>{{ newQuestion.title }}</p>
            <img :src="getFullImageUrl(newQuestion.image_explain)" alt="Explanation Image" class="right-image" />
          </div>
          <p>{{ newQuestion.content }}</p>
        </div>
        <button @click="closeModal">OKです</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  
  const props = defineProps({
    visible: Boolean,
    title: String,
    newQuestion: Object
  });
  
  const getFullImageUrl = (url) => {
    const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
    return prefix + url;
  };
  
  const closeModal = () => {
    // Emit an event to close the modal, if needed
    // You can emit an event like this: `emit('close')`
    // and handle it in the parent component to close the modal.
    // Example: `@close="visible = false"` in parent component.
  };
  
  console.log('newQuestion:', newQuestion); // Thêm dòng này để in ra giá trị newQuestion
  </script>
  
  
  <style scoped>
  .modal-overlay {
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
  
  .modal-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }
  
  .modal-container h2 {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .modal-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .right-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-left: 10px;
  }
  
  .text-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }
  
  button:focus {
    outline: none;
  }
  </style>
  