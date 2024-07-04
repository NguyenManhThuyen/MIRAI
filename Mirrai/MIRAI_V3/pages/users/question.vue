<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <HeaderStampQuestionUser :numberOfQuestions="6" :currentQuestion="3" />
    <div class="quiz-body">
      <img src="@/assets/images/question-image.svg" />
      <div class="question-text">
        <h2>問題1:</h2>
      </div>
      <p class="question-name">{{ currentQuestion.text }}</p>

      <div class="answers">
        <div
          class="answer-option"
          v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          @click="selectAnswer(index)"
          :class="{ 'selected': selectedAnswer === index }"
        >
          <button
            :class="'option-' + String.fromCharCode(65 + index)"
            :style="{ transform: selectedAnswer === index ? 'scale(1.2)' : '' }"
          >{{ String.fromCharCode(65 + index) }}</button>
          <p>{{ answer }}</p>
        </div>
      </div>
    </div>
    <FooterQuestionUser />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const questions = ref([
  {
    text: '名古屋に行った際に訪れるべきおすすめの観光スポットはどこですか？',
    answers: ['川崎', '箱根', 'これはデザインに関する長い回答の説明です', '彦根']
  },
  // Add more questions here
]);

const currentQuestionIndex = ref(0);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const selectedAnswer = ref(null);

function selectAnswer(index) {
  if (selectedAnswer.value !== null) {
    return; // Prevent changing the answer if one is already selected
  }
  
  selectedAnswer.value = index;
  
  // Navigate to a new route after 3 seconds
  setTimeout(() => {
    router.push('/users/questionCorrect');
  }, 3000);
  
  // Animate the button scale for 3 seconds
  const button = document.querySelectorAll('.answer-option button')[index];
  if (button) {
    button.classList.add('hover-animation');
    setTimeout(() => {
      button.classList.remove('hover-animation');
    }, 3000);
  }
}
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

.quiz-navigation button {
  margin: 0.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1; 
}

.quiz-body img {
  width: 100%;
  height: auto;
}

.question-text {
  margin: 10px 0;
}

.question-text h2 {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #626263;
}

.question-name {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  margin: 12px 16px;
}

.answers {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.answer-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 78px;
  border-bottom: 1px solid #E3E4EC;
  transition: background-color 0.3s;
  position: relative;
}

.answer-option:last-child {
  border-bottom: none;
}

.answer-option.selected {
  background-color: #F1F4F9;
}

.answer-option p {
  padding-left: 12px;
  margin-right: 16px;
  flex: 1;
  text-align: left;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  color: #4B4B4D;
}

.answers button {
  width: 40px;
  height: 40px;
  border: 2px solid #D6D6D6;
  background-color: white;
  color: #0082CA;
  border-radius: 50%;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}

.answers button.hover-animation {
  animation: hover-animation 1.5s infinite alternate;
}

@keyframes hover-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

</style>
