<!-- components/question.vue -->
<template>
    <div class="question-component">
      <div class="question-id">
        <span>{{ id }}</span>
      </div>
      <div class="question-text">
        <p>{{ questionText }}</p>
      </div>
      <div class="floor-number">
        <button>{{ floor }}階</button>
        <button @click="deleteQuestion">🗑️</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    id: {
      type: Number,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    floor: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['delete']);
  
  const deleteQuestion = () => {
    emit('delete', props.id);
  };
  </script>
  
  <style scoped>
  .question-component {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
  }
  
  .question-id {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .question-text {
    flex: 1;
  }
  
  .floor-number button {
    margin-left: 5px;
  }
  </style>
  