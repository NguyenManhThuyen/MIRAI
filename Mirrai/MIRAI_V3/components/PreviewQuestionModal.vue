<template>
    <div v-if="visible" class="modal" @click="handleOverlayClick($event)">
      <div class="quiz-container">
        <HeaderQuestionUser />
        <HeaderStampQuestionUser :numberOfQuestions="6" :currentQuestion="3" />

        <FooterQuestionUser />
      </div>
    </div>
  </template>
  
  <script>
import { toRefs, defineProps, defineEmits  } from 'vue';

const props = defineProps({
  visible: Boolean
});
const { visible  } = toRefs(props);

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    close(); 
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    margin-right: 4px;
  }
  
  </style>
  