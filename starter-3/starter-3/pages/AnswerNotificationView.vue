<template>
  <div class="view-container">
    <AnswerNotification
      :correctAnswer="$route.query.correctAnswer"
      :isCorrect="$route.query.isCorrect === 'true'"
      :correctAnswerExplain="$route.query.correctAnswerExplain"
      :floor="$route.query.floor"
    />
    <div class="footer-wrapper">
      <FooterQuestion :footerImage="footerImage" class="footer-question" />
    </div>
  </div>
</template>


<script>
import AnswerNotification from '@/components/AnswerNotification.vue';
import FooterQuestion from '@/components/FooterQuestion.vue';

export default {
  components: {
    AnswerNotification,
    FooterQuestion,
  },
  props: {
    correctAnswer: {
      type: String,
      required: true
    },
    correctAnswerExplain: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    floor: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      footerImage : localStorage.getItem("imageFooter"),
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
  height: 100dvh; /* Chiều cao của phần còn lại của trang */

  
}

.footer-wrapper {
  margin-top: auto; /* Footer sẽ luôn nằm ở dưới cùng */
  width: 100%;
}
</style>
