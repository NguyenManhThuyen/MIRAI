<template>
  <div class="quiz-container">
    <HeaderStampQuestionUser :admin="true"/>
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
        <div v-if="shouldShowExplanation" class="gray-background">
          <div class="section-title">解説</div>
          <img v-if="explainImg" :src="getFullImageUrl(explainImg)" />
          <img v-else src="@/assets/images/question-correct-explain.svg" />
          <div class="explanation-text">
            <p v-html="explain"></p>
          </div>
        </div>
        <div v-if="shouldShowFooter" class="gray-background-footer">
          <div class="next-question">
            次の問題に到着したらカメラを立ち上げてQRを読み込んでね！
          </div>
          <img src="@/assets/images/question-correct-uemiya.svg" class="qr-code" />
        </div>
        <div v-else class="button-container">
          <button class="download-button" @click="goToResults">最後の結果へ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
  layout: "users",
});


const route = useRoute();
const router = useRouter();

const answer = ref(route.query.answer || '');
const content = ref(route.query.content || '');
const explain = ref(route.query.explain || '');
const explainImg = ref(route.query.explainImg || '');
const questionsCount = ref(route.query.questionsCount || 0 );
const shouldShowExplanation = ref(true); // Default to true
const shouldShowFooter = ref(true); // Default to true

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};

const goToResults = () => {
  router.push('/users/questionResult');
};

onMounted(async () => {
  if (!explain.value && !explainImg.value) {
    shouldShowExplanation.value = false;
  }
  const storedResults = localStorage.getItem('results');
  if (storedResults) {
    const results = JSON.parse(storedResults);
    if (results.length === questionsCount) {
      shouldShowFooter.value = false;
    }
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
  min-height: 64px;
  height: fit-content;
  padding: 8px 12px;
  border-radius: 15.32px;
  margin: 0px 16px;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
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
  margin: 8px 16px 48px 16px;
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

.button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.download-button {
  padding: 17px 38px;
  gap: 10px;
  border-radius: 49px;
  background-color: #31D0AA;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #FFFFFF;
  border: none;
  transition: transform 0.5s ease-in-out; /* Thêm hiệu ứng transition */
}
</style>
