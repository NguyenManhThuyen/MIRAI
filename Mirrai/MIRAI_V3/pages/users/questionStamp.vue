<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <div class="quiz-body">
      <img :src="questionStampImage" class="qr-code" @mousedown="startDownloadTimer" @mouseup="cancelDownloadTimer" @mouseleave="cancelDownloadTimer" />
      <div class="button-container">
        <button class="download-button" @click="goToResults">
          <span class="button-icon"></span> 結果ページに戻る
        </button>
      </div>
    </div>
    <FooterQuestionUser />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import questionStampImage from '@/assets/images/question-stamp.png';
import { saveAs } from 'file-saver'; // Đảm bảo bạn đã cài đặt thư viện file-saver

const router = useRouter();
const downloadTimer = ref(null);

const goToResults = () => {
  router.push('/users/questionResult');
};

const startDownloadTimer = () => {
  downloadTimer.value = setTimeout(() => {
    saveAs(questionStampImage, 'question-stamp.png');
  }, 1000); // 1 giây = 1000 milliseconds
};

const cancelDownloadTimer = () => {
  clearTimeout(downloadTimer.value);
  downloadTimer.value = null;
};
</script>


<style scoped>
.quiz-container {
  text-align: center;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa các phần tử theo chiều ngang */
  justify-content: center; /* Căn giữa các phần tử theo chiều dọc */
}

.quiz-body img {
  width: 100%
}

.qr-code {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px; /* Khoảng cách dưới của ảnh */
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%; /* Đảm bảo container chiếm toàn bộ chiều rộng */
}

.download-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 38px;
  border-radius: 49px;
  background-color: #31d0aa;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #ffffff;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.download-button .button-icon {
  width: 24px; /* Kích thước của biểu tượng */
  height: 24px;
  background-image: url('@/assets/images/Arrow - Right 2.svg'); /* Đường dẫn đến biểu tượng Arrow - Right 2 */
  background-size: cover;
  margin-right: 10px; /* Khoảng cách giữa biểu tượng và văn bản */
}

.download-button:hover {
  background-color: #1eae8a; /* Màu nền khi hover */
}
</style>
