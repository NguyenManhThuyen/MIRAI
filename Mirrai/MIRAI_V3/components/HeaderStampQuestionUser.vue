<script setup>
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
  color: Boolean,
  admin: Boolean,
  additionalId: String, // Thêm prop kiểu chuỗi
});

const questionHeader = ref(null);
const numberOfQuestions = ref(0);
const results = ref([]);
const questions = ref([]);

const fetchQuestions = async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    questions.value = response.data;

    // Nếu có additionalId, thêm đối tượng vào cuối mảng questions
    if (props.additionalId) {
      questions.value.push({ sort: props.additionalId });
    }
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
  return results.value.some(result => parseInt(result.id)=== questionId && result.status === true && props.admin);
};

const isQuestionIncorrect = (index) => {
  const questionId = questions.value[index - 1]?.id;
  return results.value.some(result => parseInt(result.id) === questionId && result.status === false && props.admin);
};
</script>
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
        <span>Q.{{ question.sort }}</span>
      </div>
      <img class="question-arrow" src="@/assets/images/question-arrow-yellow.svg"/>
    </div>
  </div>
</template>

<style scoped>
.question-header {
  position: sticky;
  flex-wrap: wrap;
  gap: 8px;
  top: 0px;
  padding: 12px 0 16px 12px;
  margin: 0 -4px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  background-image: url('@/assets/images/question-background.svg');
  background-repeat: repeat;
  background-position: center top;
  scrollbar-width: none;
  -ms-overflow-style: none;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
  justify-content: center;
}

.question-header.colorful {
  background-image: url('@/assets/images/question-background-yellow.svg');
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
  min-width: 42px;
  border-radius: 50%;
  background-color: transparent;
  color: #fff;
  border: 1.75px solid #ffffff8a;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14.7px;
  font-weight: 700;
  line-height: 21.29px;
  letter-spacing: 0.02em;
  text-align: center;
}

.circle span {
  display: flex;
  justify-content: center;
  height: fit-content;
  margin-bottom: 2px;
}

.circle.incorrect {
  background-color: white;
  color: black;
  position: relative;
}

.circle.incorrect::before, .circle.incorrect::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 3px;
  background-color: #2E7CF6;
  transform: translate(-50%, -50%) rotate(45deg);
  border-radius: 2px;
}

.circle.incorrect::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.circle.correct {
  color: #6A6A6A;
  position: relative;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
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
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
  border: none;
}

.circle.correct::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35.7px;
  height: 35.7px;
  background-color: transparent;
  border: 3px solid red;
  border-radius: 50%;
  box-sizing: border-box;
  z-index: 1;
}

.question-arrow {
  margin-left: 8px;
}

.question.last-in-row {
  max-width: 42px;
}

.question.last-in-row .question-arrow {
  display: none;
}
</style>
