<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <HeaderStampQuestionUser :numberOfQuestions="6" :currentQuestion="3" />
    <div class="quiz-body">
      <!-- Ảnh question-correct.svg -->
      <img src="@/assets/images/question-correct.svg" />

      <!-- Text câu trả lời đúng -->
      <div class="correct-answer">
        <div class="circle">{{ answer }}</div>
        <span class="answer-text">{{ content }}</span>
      </div>

      <!-- Phần giải thích -->
      <div class="explanation">
        <div class="gray-background">
          <div class="section-title">解説</div>
          <img v-if="explainImg" :src="getFullImageUrl(explainImg)"  />
          <img v-else src="@/assets/images/question-correct-explain.svg" />
          <div class="explanation-text">
            <p v-html="explain"></p>
          </div>
        </div>
        <div class="gray-background-footer" v-if="shouldShowFooter">
          <div class="next-question">
            {{ subtitle }}
          </div>
          <img src="@/assets/images/question-correct-uemiya.svg" class="qr-code" />
        </div>
      </div>
    </div>
    <FooterQuestionUser />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();

const answer = ref(route.query.answer || '');
const content = ref(route.query.content || '');
const explain = ref(route.query.explain || '');
const explainImg = ref(route.query.explainImg || '');
const subtitle = ref('');
const shouldShowFooter = ref(true); // Default to true

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};

onMounted(async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/2');
    console.log(response.data);
    if (response.data.noti === null || !response.data.content) {
      shouldShowFooter.value = false; // Hide footer
    } else {
      subtitle.value = response.data.content;
    }
  } catch (error) {
    console.error('Error fetching subtitle:', error);
    // Handle error or set default subtitle
    shouldShowFooter.value = false; // Hide footer
  }
});
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

.HeaderStampQuestionUser {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: white; /* Điều chỉnh màu nền nếu cần thiết */
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1;
  overflow: hidden; /* Đảm bảo ảnh không vượt quá kích thước của div cha */
}

.quiz-body img {
  max-height: 300px;
  max-width: 100%; /* Đảm bảo ảnh không vượt quá chiều rộng của phần tử cha */
  height: auto; /* Đảm bảo tỷ lệ khung hình */
  object-fit: contain; /* Đảm bảo ảnh vừa với phần tử chứa mà không bị cắt */
  border-radius: 12px;
}
.correct-answer {
  display: flex;
  align-items: center;
  background-color: #F1F4F9;
  height: 64px;
  padding: 8px 12px;
  border-radius: 15.32px;
  margin: 0px 16px;
}


.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FFFFFF;

  color: #8d1616;
  border: 2.67px solid #D6D6D6;

  font-family: Noto Sans JP;
  font-size: 26.67px;
  font-weight: 700;
  line-height: 38.61px;
  letter-spacing: 0.02em;
  text-align: center;

}

.answer-text {
  font-family: Noto Sans JP;
  font-size: 24px;
  font-weight: 700;
  line-height: 34.75px;
  text-align: left;
  color: #E23437;
  margin-left: 16px;
}

.explanation {
  margin-top: 8px;
  position: relative;
  padding-top: 8px;

  /* Tạo dashline */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%; /* Đưa dashline về giữa */
    transform: translateX(-50%); /* Dịch chuyển dashline về trái 50% của chính nó */
    width: calc(100% - 32px); /* Chiều rộng của dashline, trừ bớt padding */
    border-top: 2px dashed #ccc;
  }
}


.gray-background {
  background-color: #f0f0f0;
  padding: 16px;
  gap: 12px;
  border-radius: 23px;
  overflow: hidden; /* Đảm bảo ảnh không vượt quá kích thước của div cha */
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: left;
}

.section-title img {
  width: 100%; /* Đảm bảo ảnh chiếm toàn bộ chiều rộng của phần tử chứa */
  height: auto; /* Đảm bảo ảnh duy trì tỷ lệ khung hình */
  object-fit: contain; /* Đảm bảo ảnh vừa với phần tử chứa mà không bị cắt */
}
.explanation-image {
  max-width: 100%; /* Đảm bảo ảnh không vượt quá chiều rộng của phần tử cha */
  height: auto; /* Đảm bảo tỷ lệ khung hình */
  object-fit: contain; /* Đảm bảo ảnh vừa với phần tử chứa mà không bị cắt */
}


.explanation-text {
  text-align: left;
  margin-top: 12px;
  font-size: 16px;
  line-height: 24px;
}

.gray-background-footer {
  display: flex;
  background-color: #f0f0f0;
  padding: 16px;
  margin: 8px 16px 48px 16px ;
  gap: 12px;
  border-radius: 23px;
  align-items: center;
  justify-content: space-between;
}

.next-question {
  font-size: 18px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #0082CA;
}

.gray-background-footer img {
  max-width: 35px;
}

.qr-code {
  max-width: 100%;
  height: auto;
}
</style>
