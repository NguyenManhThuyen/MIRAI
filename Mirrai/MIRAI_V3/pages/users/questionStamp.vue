<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <div class="quiz-body">
      <img src="@/assets/images/question-stamp.svg" class="qr-code" />
      <button class="download-button">
        <span class="button-icon"></span> 結果ページに戻る
      </button>
    </div>
    <FooterQuestionUser />
  </div>
</template>

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
