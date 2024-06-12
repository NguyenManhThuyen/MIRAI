<template>
  <div class="quiz-container">
    <!-- <img :src="bannerUrl" alt="Mirai Tower" class="quiz-image" /> -->
    <img src="@/assets/images/mirai-tower.svg" alt="Mirai Tower" class="quiz-image" />

    <div class="content">
      <div class="question-counter">
        <span class="counter-text">{{ `質問 ${floor}` }}</span>
      </div>
      <div class="question">
        <h2>{{ questionName }}</h2>
      </div>
      <div class="answers">
        <button
          v-for="(option, key) in options"
          :key="key"
          :class="[
            'answer',
            {
              correct:
                isAnswered &&
                selectedAnswer === correctAnswerName &&
                selectedAnswer === key,
              wrong:
                isAnswered &&
                selectedAnswer !== correctAnswerName &&
                selectedAnswer === key,
              'no-hover': isAnswered,
            },
          ]"
          @click="handleAnswer(key)"
          :disabled="isAnswered"
          class="answer-button"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizQuestion",
  props: {
    bannerUrl: {
      type: String,
    },
    correctAnswerExplain: {
      type: String,
    },
    correctAnswerName: {
      type: String,
    },
    footerUrl: {
      type: String,
    },
    id: {
      type: Number,
    },
    options: {
      type: Object,
    },
    questionName: {
      type: String,
    },
    floor: {
      type: Number,
    },
  },
  data() {
    return {
      isAnswered: false,
      selectedAnswer: null,
    };
  },
  methods: {
    handleAnswer(key) {
      if (!this.isAnswered) {
        this.selectedAnswer = key;
        this.isAnswered = true;
        const isCorrect = key === this.correctAnswerName;

        // Tăng giá trị của totalAnswer
        let totalAnswer = parseInt(localStorage.getItem("totalAnswer") || 0, 10) + 1;
        localStorage.setItem("totalAnswer", totalAnswer.toString());

        // Nếu trả lời đúng, tăng giá trị của correctAnswer
        if (isCorrect) {
          let correctAnswer =
            parseInt(localStorage.getItem("correctAnswer") || 0, 10) + 1;
          localStorage.setItem("correctAnswer", correctAnswer.toString());
        }

        setTimeout(() => {
          this.$router.push({
            path: `/AnswerNotificationView`,
            query: {
              isCorrect: isCorrect.toString(),
              correctAnswer: this.options[this.correctAnswerName],
              correctAnswerExplain: this.correctAnswerExplain,
            },
          });
        }, 5000);
      }
    },
  },
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
  margin-top: 16px;
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
  font-size: 16px; /* Tăng kích thước chữ */
  color: #333;
  margin-bottom: 12px; /* Tăng khoảng cách dưới */
}

.counter-text {
  display: inline-block;
  width: auto;
  height: auto;
  border-radius: 61px;
  padding: 10px 14px; /* Tăng padding */
  background-color: #0e0e2c;
  color: #fff;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 14px; /* Tăng kích thước chữ */
  font-weight: 400;
  line-height: 17.38px;
  text-align: center;
}

.question {
  margin-bottom: 20px; /* Tăng khoảng cách dưới */
}

.question h2 {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 24px; /* Tăng kích thước chữ */
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
}

.answers {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px; /* Tăng khoảng cách dưới */
}

.answer-button {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 12px; /* Tăng padding */
  border-radius: 12px;
  font-size: 16px; /* Tăng kích thước chữ */
  margin: 8px 0; /* Tăng khoảng cách giữa các nút */
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
