<template>
  <div class="quiz-view">
    <QuizQuestion 
      :id="id"
      :total-questions="totalQuestions"
      :question="questions[id].text"
      :answers="questions[id].answers"
      :correct-answers="questions[id].correctAnswers"
    />
    <FooterQuestion :footerImage="footerImage" class="footer-question" />
  </div>
</template>

<script>
import QuizQuestion from '@/components/QuizQuestion.vue';
import FooterQuestion from '@/components/FooterQuestion.vue';
import footerImage from '@/assets/images/footerQuestion.png'; // Import the image
import questionsData from '@/pages/questions.json';

export default {
  components: {
    QuizQuestion,
    FooterQuestion,
  },
  
  data() {
    return {
      id: parseInt(this.$route.params.id), // Convert id from string to number
      footerImage, // Use the imported image
      questions: questionsData
    };
  },
  
  computed: {
    totalQuestions() {
      return this.questions.length;
    }
  },
  
  methods: {
    toggleDropdown(newLanguage) {
      console.log('Language changed to:', newLanguage);
      // Handle language change logic here
    }
  },

  mounted() {
    console.log('questions:', this.questions);
    console.log('id:', this.id);
  }
};
</script>

<style scoped>
.quiz-view {
  display: flex;
  flex-direction: column; /* Stack the elements vertically */
  align-items: center; /* Canh giữa theo chiều ngang */
  padding-top: 24px; /* Canh lề trên */
  background-color: #F9EFE3; /* Màu nền */
  background-image: url('@/assets/images/background.svg'); /* Hình nền */
  height: 100dvh; /* Chiều cao của phần còn lại của trang */
}

.footer-question {
  margin-top: auto; /* Footer sẽ luôn nằm ở dưới cùng */
}

@media (min-width: 768px) {
  .quiz-view {
    padding: 30px;
  }
}

@media (min-width: 1024px) {
  .quiz-view {
    padding: 40px;
  }
}
</style>
