<template>
  <div class="quiz-container">
    <img src="@/assets/images/mirai-tower.svg" alt="Mirai Tower" class="quiz-image" />
    <div class="content">
      <div class="question-counter">
        <span class="counter-text">{{ `Câu hỏi ${id + 1}` }}</span>
      </div>
      <div class="question">
        <h2>{{ question }}</h2>
      </div>
      <div class="answers">
        <button 
          v-for="(answer, index) in answers" 
          :key="index" 
          :class="[
            'answer',
            {
              correct: isAnswered && correctAnswers[index],
              wrong: isAnswered && index === selectedAnswerIndex && !correctAnswers[index],
              'no-hover': isAnswered
            }
          ]" 
          @click="handleAnswer(index)"
          :disabled="isAnswered"
          class="answer-button"
        >
          {{ answer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizQuestion",
  props: {
    totalQuestions: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answers: {
      type: Array,
      required: true
    },
    correctAnswers: {
      type: Array,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      isAnswered: false,
      selectedAnswerIndex: null
    };
  },
  methods: {
    handleAnswer(index) {
      if (!this.isAnswered) {
        this.selectedAnswerIndex = index;
        this.isAnswered = true;
        const isCorrect = this.correctAnswers[index];
        const correctAnswerText = this.answers[this.correctAnswers.indexOf(true)];

        setTimeout(() => {
          this.$router.push({
            path: `/AnswerNotificationView`,
            query: {
              isCorrect: isCorrect.toString(), // Convert boolean to string
              correctAnswer: correctAnswerText,
              questionId: this.id
            }
          });
        }, 5000);
      }
    }
  }
};
</script>


<style scoped>
.quiz-container {
  background-color: #ffffff;
  border-radius: 10px;
  width: 90%;
  max-width: 343px;
  text-align: center;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.quiz-image {
  width: 120%;
  height: auto;
  padding: 1px;
  transition: transform 0.3s;
  max-width: 100%;
  border-radius: 10px 10px 0 0;
}

.quiz-container > *:not(.quiz-image) {
  padding-left: 12px;
  padding-right: 12px;
}


.question-counter {
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.counter-text {
  display: inline-block;
  width: auto;
  height: auto;
  border-radius: 61px;
  padding: 8px 12px 8px 12px;
  background-color: #0e0e2c;
  color: #fff;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 17.38px;
  text-align: center;
}

.question {
  margin-bottom: 16px;
}

.question h2 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
}

.answers {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.answer-button {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 12px;
  font-size: 14px;
  margin: 5px 0;
  cursor: pointer;
  transition: transform 0.3s, border-color 0.3s;
}

.answer-button:hover {
  transform: scale(1.05);
}

.no-hover {
  pointer-events: none;
  cursor: default;
  transform: none !important;
  border-color: inherit !important;
}

.correct {
  background-color: #31d0aa;
  color: #fff;
  border-color: #31d0aa;
}

.wrong {
  background-color: #e13a4b;
  color: #fff;
  border-color: #dc3545;
}

.correct:hover,
.wrong:hover {
  transform: none;
}

@media (min-width: 768px) {
  .quiz-container {
    width: 50%;
  }
}

@media (min-width: 1024px) {
  .quiz-container {
    width: 40%;
  }
}

@media (min-width: 1280px) {
  .quiz-container {
    width: 30%;
  }
}
</style>
