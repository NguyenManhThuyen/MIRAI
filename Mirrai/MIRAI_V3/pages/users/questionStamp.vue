<template>
  <div class="quiz-container">
    <div class="header">
      下の壁紙画像を長押ししてダウンロードしてね
    </div>
    <div class="quiz-body">
      <img 
        v-if="questionStampImage" 
        :src="questionStampImage" 
        class="qr-code" 
        @mousedown="startDownloadTimer" 
        @mouseup="cancelDownloadTimer" 
        @mouseleave="cancelDownloadTimer" 
      />
      <SkeletonLoader v-else />
      <div class="download-button-container">
        <button class="download-button" @click="startDownload">
          <img src="@/assets/images/cloud-download-icon.svg">
          <text>ダウンロード</text>
        </button>
      </div>
      <text class="info-text">
        オリジナル壁紙はスカイウォーキング・デジタルクイズチャレンジのアトラクションを完了された記念として配布しております。そのため、SNSなどでシェアしないようお願いいたします。
      </text>
      <div class="back-button-container">
        <button class="back-button" @click="goToResults">
          <img src="@/assets/images/arrow-right-blue-icon.svg">
          結果ページに戻る
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveAs } from 'file-saver'; // Đảm bảo bạn đã cài đặt thư viện file-saver
import axios from 'axios';

definePageMeta({
  layout: "users",
});

const router = useRouter();
const downloadTimer = ref(null);
const questionStampImage = ref('');

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

const startDownload = () => {
  saveAs(questionStampImage, 'question-stamp.png');
};

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};

onMounted(async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/3');
    questionStampImage.value = getFullImageUrl(response.data.content);
  } catch (error) {
    console.error('Error fetching subtitle:', error);
  }
});
</script>

<style scoped>
.quiz-container {
  text-align: center;
  padding: 0;
  margin: 0;
  flex: 1;
}

.header {
  width: 100%;
  min-height: 52px;
  padding: 16px 0;
  font-family: Noto Sans JP;
  font-size: 14px;
  font-weight: 700;
  line-height: 20.27px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
}

.quiz-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-code {
  display: block; /* Đảm bảo ảnh không có khoảng trắng bên dưới */
  width: 100%; /* Chiều rộng ảnh luôn là 100% của phần tử chứa nó */
  height: auto; /* Chiều cao tự động để giữ tỷ lệ khung hình */
  max-width: 576px; /* Đảm bảo ảnh không vượt quá chiều rộng của phần tử chứa nó */
  margin-bottom: 12px; /* Khoảng cách dưới cùng của ảnh */
}

.download-button-container,
.back-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.download-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  border-radius: 49px;
  background-color: #31d0aa;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #ffffff;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  max-height: 48px;
}

.download-button img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.download-button text {
  display: flex;
  justify-content: center;
  text-align: center;
  justify-items: center;
  margin-bottom: 2px;
}

.info-text {
  display: flex;
  flex-wrap: wrap;
  font-family: Noto Sans JP;
  font-size: 12px;
  font-weight: 400;
  line-height: 17.38px;
  letter-spacing: 0.02em;
  text-align: center;
  max-width: 359px;
  color: #6A6A6A;

  margin: 12px 12px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 38px 17px 28px;
  gap: 10px;
  border-radius: 49px 0 0 0;
  opacity: 1;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #0082CA;
  border: none;
  cursor: pointer;
  background-color: transparent;
  margin-top: 10px;
}
</style>
