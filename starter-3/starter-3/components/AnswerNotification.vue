<template>
  <div class="notification">
    <div class="notification-content">
      <div class="notification-items">
        <div class="svg-container">
          <img src="@/assets/images/cloud_left.svg" class="svg-image left" alt="Cloud Left" />
        </div>
        <div class="question-text">質問 {{ questionId }}</div>
        <div class="svg-container">
          <img src="@/assets/images/cloud_right.svg" class="svg-image right" alt="Cloud Right" />
        </div>
      </div>
    </div>
    <div class="notification-image">
      <img v-if="isCorrect" src="@/assets/images/correct.svg" class="correct-image" alt="Correct" />
      <img v-else src="@/assets/images/failed.svg" class="failed-image" alt="Failed" />
    </div>
    <div class="correct-answer-container">
      <div class="correct-answer">{{ correctAnswer }}</div>
    </div>

    <div class="custom-text">
      東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。
    </div>
    <nuxt-link to="/HappyGiftBoxView" class="custom-button">次に</nuxt-link>
  </div>
</template>

<script>
export default {
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
  name: "AnswerNotification"
};
</script>

<style scoped>
.notification {
  display: flex;
  flex-direction: column;
  width: 343px;
  height: 468px;
  padding: 16px 0px 24px 0px;
  border-radius: 16px;
  border: 2px solid #FFFFFF;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
  background-color: #FFFFFF;
}
/* Thêm đoạn này để canh giữa nút */
.notification .custom-button {
  display: flex;
  justify-content: center;
  margin-top: auto; /* Đảm bảo nút được căn sát lề dưới */
}

.notification-content {
  position: relative;
}

.notification-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 16.5px; /* Sử dụng margin bên ngoài thay vì padding */
}

.question-text {
  margin-top: 5.1px;
  opacity: 1;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #E13A4B;
}

.notification-image {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.correct-image {
  display: block;
  margin: 0 auto;
}

.correct-answer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.correct-answer {
  height: 39px;
  padding: 8px 43px;
  opacity: 1;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  text-align: center;
  color: #1A1A1A;
  border-top: 1px solid #DADADA;
  border-bottom: 1px solid #DADADA;
}

.custom-text {
  width: 100%;
  height: 80px;
  opacity: 1;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.27px;
  text-align: center;
  margin-top: 16px;
  max-width: 281px;
  margin-left: auto;
  margin-right: auto;
}

.custom-button {
  width: 135px;
  height: 44px;
  border-radius: 112px;
  opacity: 1;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  color: #FFFFFF;
  background-color: #E13A4B;

}
@media screen and (max-width: 320px) {
  .notification {
    width: 90%;
    max-width: 300px;
    margin: 0 auto;
  }

  .custom-text {
    font-size: 12px;
    line-height: 18px;
    height: auto;
    margin-top: 12px;
  }
}
</style>
