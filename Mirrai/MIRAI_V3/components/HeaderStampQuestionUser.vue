<template>
  <div 
    class="question-header"
    ref="questionHeader">
    <div 
      v-for="(question, index) in questions" 
      :key="index" 
      class="question">
      <div class="circle"
           :class="{ 
             correct: isQuestionCorrect(index + 1),
             incorrect: isQuestionIncorrect(index + 1)
           }">
        <span>Q.{{ index + 1 }}</span>
      </div>
      <img class="question-arrow" src="@/assets/images/question-arrow-yellow.svg">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
  color: Boolean,
});

const questionHeader = ref(null);
const numberOfQuestions = ref(0);
const results = ref([]);
const questions = ref([]);

const fetchQuestions = async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    questions.value = response.data;
    numberOfQuestions.value = questions.value.length;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

const updateRows = () => {
  nextTick(() => {
    if (questionHeader.value) {
      const questionElements = Array.from(questionHeader.value.children);
      questionElements.forEach(el => el.classList.remove('last-in-row', 'last-row'));

      let currentTop = null;
      let lastInRow = [];

      questionElements.forEach((question, index) => {
        const top = question.offsetTop;
        if (currentTop === null) {
          currentTop = top;
        }

        if (top !== currentTop) {
          lastInRow.push(questionElements[index - 1]);
          currentTop = top;
        }
      });

      lastInRow.push(questionElements[questionElements.length - 1]);

      lastInRow.forEach(el => el.classList.add('last-in-row'));

      const lastRowTop = lastInRow[lastInRow.length - 1]?.offsetTop;
      questionElements.forEach(question => {
        if (question.offsetTop === lastRowTop) {
          question.classList.add('last-row');
        }
      });
    }
  });
};

onMounted(async () => {
  await fetchQuestions();
  updateRows();
  window.addEventListener('resize', updateRows);

  // Trong watchEffect
  watchEffect(() => {
    const storedResults = localStorage.getItem('results');
    if (storedResults) {
      results.value = JSON.parse(storedResults);
    }

    const allAnswered = questions.value.every(question => {
      const questionId = question.id;
      return results.value.some(result => parseInt(result.id) === questionId);
    });

    if (questionHeader.value) {
    // Thêm hoặc xóa lớp 'colorful' tùy thuộc vào props.color và allAnswered
    if (props.color && allAnswered) {
      questionHeader.value.classList.add('colorful');
    } else {
      questionHeader.value.classList.remove('colorful');
    }
  }
  });

});

const isQuestionCorrect = (index) => {
  const questionId = questions.value[index - 1]?.id;
  return results.value.some(result => parseInt(result.id)=== questionId && result.status === true);
};

const isQuestionIncorrect = (index) => {
  const questionId = questions.value[index - 1]?.id;
  return results.value.some(result => parseInt(result.id) === questionId && result.status === false);
};
</script>

<style scoped>
.question-header {
  display: flex;
  position: sticky;
  flex-wrap: wrap;
  gap: 8px;
  top: 0px;
  padding: 12px 0 12px 12px;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  background-image: var(--question-background-image, url('@/assets/images/question-background.svg'));
  background-repeat: repeat;
  background-position: center top;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.question-header.colorful {
  background-image: url('@/assets/images/question-background-yellow.svg');
}

.question-header::after {
  content: "";
  display: block;
  height: 100%;
  width: 100%;
  background-image: inherit;
  background-size: contain;
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

.circle.incorrect {
  background-color: white;
  color: black; /* Màu chữ xanh */
  position: relative; /* Đặt vị trí là tương đối để các thanh chéo được định vị liên quan tới .circle */
}

.circle.incorrect::before, .circle.incorrect::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 2px;
  background-color: #007BFF; /* Màu xanh dương */
  transform: translate(-50%, -50%) rotate(45deg);
  border-radius: 2px; /* Đặt border radius tại đây */
}

.circle.incorrect::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.circle.correct {
  color: #6A6A6A; /* Màu chữ */
  position: relative; /* Đặt vị trí là tương đối để các phần tử con được định vị liên quan tới .circle */
  width: 42px; /* Đường kính 42px */
  height: 42px; /* Đường kính 42px */
  border: none;
  border-radius: 50%; /* Để làm thành hình tròn */
  background-color: rgba(255, 255, 255, 0.5); /* Màu trắng trong suốt */
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Noto Sans JP;
  font-size: 14.7px;
  font-weight: 700;
  line-height: 21.29px;
  letter-spacing: 0.02em;
  text-align: center;

}

.circle.correct::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; /* Đường kính 38px */
  height: 40px; /* Đường kính 38px */
  background-color: #fff; /* Màu trắng */
  border-radius: 50%; /* Để làm thành hình tròn */
  z-index: -1; /* Đặt z-index để đẩy lớp này xuống dưới */
  border: none;
}

.circle.correct::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35.7px; /* Đường kính 30px */
  height: 35.7px; /* Đường kính 30px */
  background-color: transparent; /* Màu nền trong suốt */
  border: 3px solid red; /* Viền đỏ dày 3px */
  border-radius: 50%; /* Để làm thành hình tròn */
  box-sizing: border-box; /* Để border kích thước tính cả padding và border */
  z-index: 1; /* Đặt z-index để lớp này hiển thị phía trên */
}

.question-arrow {
  margin-left: 8px;
}

.question.last-in-row .question-arrow {
  visibility: hidden;
  width: 8px;
}

.question.last-in-row .question-arrow::after {
  content: '';
  display: inline-block;
  width: 8px;
}
</style>
