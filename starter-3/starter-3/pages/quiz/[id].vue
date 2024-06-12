<template>
  <div class="quiz-view">
    <QuizQuestion 
      v-if="questionData.question_name"
      :bannerUrl="questionData.banner_url"
      :correctAnswerExplain="questionData.correct_answer_explain"
      :correctAnswerName="questionData.correct_answer_name"
      :footerUrl="questionData.footer_url"
      :id="id"
      :options="questionData.options"
      :questionName="questionData.question_name"
      :floor="questionData.floor"
    />
  
    <FooterQuestion :footerImage="footerImage" class="footer-question" />
  </div>
</template>

<script>
import axios from 'axios';
import QuizQuestion from '@/components/QuizQuestion.vue';
import FooterQuestion from '@/components/FooterQuestion.vue';
import footerImage from '@/assets/images/footerQuestion.png';

export default {
  components: {
    QuizQuestion,
    FooterQuestion,
  },
  
  data() {
    return {
      footerImage,
      questionData: {},
      id: null, // Khởi tạo giá trị ban đầu cho id
      apiCalled: false // Biến flag để kiểm tra đã gọi API hay chưa
    };
  },
  
  methods: {
    toggleDropdown(newLanguage) {
      console.log('Language changed to:', newLanguage);
      // Handle language change logic here
    },
    redirectToHomeUserView() {
      this.$router.push({ name: 'HomeUserView'});
    },
    fetchQuestionData(id) {
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id}`)
        .then(response => {
          this.questionData = response.data;
          console.log('Fetched question data:', this.questionData);
        })
        .catch(error => {
          console.error('Error fetching question data:', error);
        })
        .finally(() => {
          // Đặt biến flag thành true sau khi gọi API
          this.apiCalled = true;
        });
    }
  },

  mounted() {
    // Lấy ID từ route parameters
    this.id = this.$route.params.id;

    // Kiểm tra nếu người dùng đã truy cập trang web trước đó
    const hasVisited = localStorage.getItem('hasVisited');
    
    localStorage.setItem('currentId', this.id);

    // Kiểm tra nếu giá trị chưa tồn tại trong localStorage thì gán giá trị mặc định là 0
    if (localStorage.getItem('correctAnswer') === null) {
      localStorage.setItem('correctAnswer', 0);
    }

    if (localStorage.getItem('totalAnswer') === null) {
      localStorage.setItem('totalAnswer', 0);
    }

    if (hasVisited !== 'true') {
      // Nếu chưa truy cập, chuyển hướng đến HomeUserView
      this.redirectToHomeUserView();
    } else {
      // Gọi API chỉ khi biến flag là false
      if (!this.apiCalled) {
        this.fetchQuestionData(this.id);
      }
    }
  },

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
