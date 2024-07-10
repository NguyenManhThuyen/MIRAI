<template>
    <div 
      :class="['question-header', { 'completed': numberOfQuestions === currentQuestion }]" 
      ref="questionHeader">
      <div 
        v-for="index in numberOfQuestions" 
        :key="index" 
        class="question"
        :class="{ 
          active: index <= currentQuestion,
          correct: isQuestionCorrect(index),
          incorrect: isQuestionIncorrect(index)
        }">
        <div class="circle">
          <span>Q.{{ index }}</span>
          <div v-if="isQuestionCorrect(index)" class="correct-indicator">
            <div class="inner-circle"></div>
          </div>
          <div v-if="isQuestionIncorrect(index)" class="incorrect-indicator">
            <div class="cross"></div>
            <div class="cross"></div>
          </div>
        </div>
        <img class="question-arrow" src="@/assets/images/question-arrow-yellow.svg">
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect, nextTick } from 'vue';
  
  const props = defineProps({
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    currentQuestion: {
      type: Number,
      default: 1,
    },
  });
  
  const questionHeader = ref(null);
  const results = ref([]);
  
  const updateRows = () => {
    nextTick(() => {
      if (questionHeader.value) {
        const questions = Array.from(questionHeader.value.children);
        questions.forEach(el => el.classList.remove('last-in-row', 'last-row'));
  
        let currentTop = null;
        let lastInRow = [];
  
        questions.forEach((question, index) => {
          const top = question.offsetTop;
          if (currentTop === null) {
            currentTop = top;
          }
  
          if (top !== currentTop) {
            lastInRow.push(questions[index - 1]);
            currentTop = top;
          }
        });
  
        lastInRow.push(questions[questions.length - 1]);
  
        lastInRow.forEach(el => el.classList.add('last-in-row'));
  
        const lastRowTop = lastInRow[lastInRow.length - 1]?.offsetTop;
        questions.forEach(question => {
          if (question.offsetTop === lastRowTop) {
            question.classList.add('last-row');
          }
        });
      }
    });
  };
  
  onMounted(() => {
    updateRows();
    window.addEventListener('resize', updateRows);
  });
  
  watchEffect(() => {
    const storedResults = localStorage.getItem('results');
    if (storedResults) {
      results.value = JSON.parse(storedResults);
    }
  });
  
  const isQuestionCorrect = (index) => {
    const questionId = index; // Tùy vào cách bạn định nghĩa id cho câu hỏi
    return results.value.some(result => result.id === questionId && result.status === 'correct');
  };
  
  const isQuestionIncorrect = (index) => {
    const questionId = index; // Tùy vào cách bạn định nghĩa id cho câu hỏi
    return results.value.some(result => result.id === questionId && result.status === 'incorrect');
  };
  </script>
  
  <style scoped>
  .question-header {
    display: flex;
    position: sticky;
    flex-wrap: wrap;
    gap: 8px;
    top: 0px;
    padding: 12px;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden; /* Ẩn thanh cuộn ngang nếu có */
    z-index: 999;
    background-image: url('@/assets/images/question-background.svg');
    background-repeat: repeat; /* Lặp lại nền theo cả chiều ngang và dọc */
    background-position: center top; /* Căn giữa và top cho nền */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  .question-header.completed {
    background-image: url('@/assets/images/question-background-yellow.svg');
  }
  
  .question-header::after {
    content: "";
    display: block;
    height: 100%;
    width: 100%;
    background-image: inherit;
    background-size: contain; /* Chỉnh kích thước nền theo cần thiết */
  }
  
  .question {
    display: flex;
    align-items: center;
    font-family: "Noto Sans JP", sans-serif;
    font-weight: bold;
  }
  
  .circle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: transparent;
    color: #fff;
    border: 1.75px solid #ffffff8a;
    font-family: Noto Sans JP;
    font-size: 14.7px;
    font-weight: 700;
    line-height: 21.29px;
    letter-spacing: 0.02em;
    text-align: center;
  }
  
  .circle.active {
    border-color: red;
  }
  
  .question-arrow {
    margin-left: 8px;
  }
  
  .correct-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .inner-circle {
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
  }
  
  .incorrect-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  }
  
  .cross {
    width: 8px;
    height: 8px;
    background-color: blue;
    transform: rotate(45deg);
  }
  
  .question.last-in-row .question-arrow {
    visibility: hidden; /* Sử dụng visibility để giữ nguyên không gian chiếm bởi phần tử */
    width: 8px; /* Đảm bảo chiều rộng của phần tử để giữ không gian layout */
  }
  
  .question.last-in-row .question-arrow::after {
    content: ''; /* Sử dụng content rỗng để không hiển thị bất kỳ nội dung nào */
    display: inline-block;
    width: 8px; /* Đảm bảo chiều rộng tương tự với phần tử arrow */
  }
  </style>
  