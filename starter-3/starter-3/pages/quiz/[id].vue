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
  
    <FooterQuestion v-if="footerImage" :footerImage="footerImage" class="footer-question" />
  </div>
</template>

<script>
import axios from 'axios';
import QuizQuestion from '@/components/QuizQuestion.vue';
import FooterQuestion from '@/components/FooterQuestion.vue';

export default {
  components: {
    QuizQuestion,
    FooterQuestion,
  },
  
  data() {
    return {
      footerImage:'',
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
    redirectToHappyGiftBoxView() {
      this.$router.push({ name: 'HappyGiftBoxView'});
    },
    fetchQuestionData(id) {
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id}`)
        .then(response => {
          this.questionData = response.data;
          this.footerImage = this.questionData.footer_url;
          localStorage.setItem("imageFooter", this.footerImage);
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

    const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    // Filter out questions that were answered more than 1 day (24 hours) ago
    let updatedQuestions = answeredQuestions.filter(entry => {
        return !(entry.timestamp && (now - entry.timestamp) > oneDayInMillis);
    });

    if (updatedQuestions.some(entry => entry.id === this.id)) {
        // Nếu câu hỏi đã được trả lời
        const answeredQuestion = updatedQuestions.find(entry => entry.id === this.id);
        if (answeredQuestion && (now - answeredQuestion.timestamp) > oneDayInMillis) {
            // Nếu câu hỏi đã được trả lời và quá 1 ngày, xoá ID này
            updatedQuestions = updatedQuestions.filter(entry => entry.id !== this.id);
            localStorage.setItem('answeredQuestions', JSON.stringify(updatedQuestions));
        }
        alert('この質問にはすでに回答しています。');
        // Chuyển hướng nếu quiz đã được trả lời
        this.redirectToHappyGiftBoxView();
    } else {
        // Gọi API chỉ khi biến flag là false
        if (hasVisited !== 'true') {
            // Nếu chưa truy cập, chuyển hướng đến HomeUserView
            this.redirectToHomeUserView();
        } else if (!this.apiCalled) {
            // Nếu chưa gọi API, gọi hàm fetchQuestionData
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

  max-height: calc(100dvh); /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */

    /* Hide scrollbar for WebKit browsers */
    scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
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
