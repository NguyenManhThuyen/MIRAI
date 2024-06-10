<template>
  <div class="view-container">
    <AnswerNotification
      :questionId="Number($route.params.questionId)"
      :correctAnswer="$route.query.correctAnswer"
      :isCorrect="$route.query.isCorrect === 'true'"
    />
    <div class="footer-wrapper">
      <FooterQuestion :footerImage="footerImage" class="footer-question" />
    </div>
  </div>
</template>

<script>
import AnswerNotification from '@/components/AnswerNotification.vue';
import FooterQuestion from '@/components/FooterQuestion.vue';
import footerImage from '@/assets/images/footerQuestion.png';

export default {
  components: {
    AnswerNotification,
    FooterQuestion,
  },
  props: {
    questionId: {
      type: Number,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      footerImage,
    };
  },
  mounted() {
    // Log the received props to the console
    console.log('questionId:', this.questionId);
    console.log('correctAnswer:', this.correctAnswer);
    console.log('isCorrect:', this.isCorrect);
  }
};
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 62px;
  background-color: #F9EFE3; /* Màu nền */
  background-image: url('@/assets/images/background.svg'); /* Hình nền */
  height: 100vh; /* Chiều cao của phần còn lại của trang */
}

.footer-wrapper {
  margin-top: auto; /* Footer sẽ luôn nằm ở dưới cùng */
}
</style>
