<template>
  <div class="notification">
    <div class="notification-content">
      <div class="notification-items">
        <div class="svg-container">
          <img src="@/assets/images/cloud_left.svg" class="svg-image left" alt="Cloud Left" />
        </div>
        <div class="question-text">質問 {{ floor }}</div>
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
      {{ correctAnswerExplain }}
    </div>
    <nuxt-link :to="{ path: '/HappyGiftBoxView', query: { floor: floor } }" class="custom-button">次に</nuxt-link>

  </div>
</template>

<script>
export default {
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
  name: "AnswerNotification"
};
</script>

<style scoped>
.notification {
  display: flex;
  flex-direction: column;
  width: 343px; /* Increased width */
  height: auto;
  padding: 24px 16px 32px 16px; /* Increased padding */
  border-radius: 16px;
  border: 2px solid #FFFFFF;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
  background-color: #FFFFFF;
}

.notification .custom-button {
  display: flex;
  justify-content: center;
  margin-top: 12px; /* Ensures button is more spaced from elements above */
}

.notification-content {
  position: relative;
}

.notification-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 20px; /* Increased margin */
}

.question-text {
  margin-top: 10px; /* Increased margin */
  opacity: 1;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 28px; /* Increased font size */
  font-weight: 700;
  text-align: center;
  color: #E13A4B;
}

.notification-image {
  display: flex;
  justify-content: center;
  margin-top: 32px; /* Increased margin */
}

.correct-image {
  display: block;
  margin: 0 auto;
}

.correct-answer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px; /* Increased margin */
}
.correct-answer {
  height: 50px;
  padding: 12px 48px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
  border-top: 1px solid #DADADA;
  border-bottom: 1px solid #DADADA;
}
.custom-text {
  width: 255px; /* Limit width to 255px */
  max-height: 100px; /* Limit maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  opacity: 1;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 16px;
  color: #6a6a6a;
  overflow-wrap: break-word; /* Ensures long words wrap */
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}

.custom-text::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, Edge */
}

@media (max-height: 100px) {
  .custom-text {
    overflow-y: scroll; /* Enable scroll bar if content exceeds max-height */
  }
}

.custom-button {
  width: 150px; /* Increased width */
  height: 48px; /* Increased height */
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
    font-size: 14px; /* Increased font size */
    line-height: 20px; /* Increased line height */
    height: auto;
    margin-top: 16px; /* Increased margin */
  }
}

</style>
