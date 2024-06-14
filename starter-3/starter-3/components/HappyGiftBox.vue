<template>
  <div class="notification">
    <div class="notification-content">
      <div class="notification-items">
        <div class="svg-container">
          <img
            src="@/assets/images/cloud_left.svg"
            class="svg-image left"
            alt="Cloud Left"
          />
        </div>
        <div class="question-text">結果です</div>
        <div class="svg-container">
          <img
            src="@/assets/images/cloud_right.svg"
            class="svg-image right"
            alt="Cloud Right"
          />
        </div>
      </div>
    </div>
    <div class="notification-image">
      <div class="text">トップになりましょう！</div>
    </div>
    <div class="notification-image">
      <div class="text"> ギフトが待たされるよ！</div>
    </div>

    <img src="@/assets/images/happy-giftbox.svg" class="correct-image" alt="Correct" />
    <div class="correct-answer-container">
      <div class="correct-answer">
        {{ trueAnswerQuestionFromStorage }}/{{ totalQuestionFromStorage }}
      </div>
    </div>

    <div class="custom-text">
      （この画面を審査員にご提示いただき、正解数に応じてプレゼントを差し上げます。）
    </div>
    <button class="custom-button" @click="share">
      <span class="button-content">
        <img src="@/assets/images/share.svg" class="share" alt="share" />
        共有
      </span>
    </button>

    <div v-if="showShareModal" class="share-modal">
      <div class="modal-content">
        <h2> Share social </h2>
        <!-- Social share icons -->
        <div class="flex flex-row gap-2">
          <SocialShare
            v-for="network in ['facebook', 'linkedin', 'email','pinterest','whatsapp','telegram']"
            :key="network"
            :network="network"
            :styled="true"
            :label="false"
            :title="'212121'"
            :url="'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'" 
            class="p-4 rounded-none"
          />
        </div>
        <!-- Close button for the modal -->
        <button @click="closeShareModal" class="close-button">X</button>
      </div>
    </div>
    

  </div>
</template>

<script>
import NavigatorShare from "vue-navigator-share";

export default {
  props: {
    questionId: {
      type: Number,
    },
    trueAnswerQuestion: {
      type: Number,
    },
    totalQuestion: {
      type: Number,
    },
  },
  name: "HappyGiftBox",
  components: {
    NavigatorShare,
  },
  data() {
    return {
      showShareModal: false,
      trueAnswerQuestionFromStorage: 0,
      totalQuestionFromStorage: 0,
      floor: null,
    };
  },

  computed: {
    url() {
      return window.location.href;
    },
    title() {
      return document.title;
    }
  },

  mounted() {
    // Get values from localStorage and set to component's data
    this.trueAnswerQuestionFromStorage = parseInt(localStorage.getItem("correctAnswer") || 0, 10);
    this.totalQuestionFromStorage = parseInt(localStorage.getItem("totalAnswer") || 0, 10);


  },

  methods: {
    onError(err) {
      alert(err);
      console.log(err);
    },
    onSuccess(err) {
      console.log(err);
    },
    share() {
      this.showShareModal = true; // Show the modal when share button is clicked
    },
    closeShareModal() {
      this.showShareModal = false; // Close the modal
    },
  }
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
  border: 2px solid #ffffff;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

/* Center the button */
.notification .custom-button {
  display: flex;
  justify-content: center;
  margin-top: 24px; /* Ensure button is spaced from elements above */
}

.notification-content {
  position: relative;
  margin-bottom: 32px; /* Increased margin */
}

.notification-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 12px; /* Increased margin */
}

.question-text {
  margin-top: 10px; /* Increased margin */
  opacity: 1;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 28px; /* Increased font size */
  font-weight: 700;
  text-align: center;
  color: #e13a4b;
}

.text {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 18px; /* Increased font size */
  font-weight: 700;
  line-height: 26px; /* Increased line height */
  letter-spacing: 0.01em;
  text-align: center;
}

.notification-image {
  display: flex;
  justify-content: center;
  margin-left: 46px;
  margin-right: 46px;
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
  width: 160px; /* Increased width */
  height: 50px; /* Increased height */
  padding: 12px 48px; /* Increased padding */
  opacity: 1;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 18px; /* Increased font size */
  font-weight: 700;
  line-height: 26px; /* Increased line height */
  text-align: center;
  color: #e13a4b;
  border-top: 1px solid #dadada;
  border-bottom: 1px solid #dadada;
}

.custom-text {
  width: 100%;
  height: auto;
  opacity: 1;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px; /* Increased font size */
  font-weight: 400;
  line-height: 24px; /* Increased line height */
  text-align: center;
  margin-top: 24px; /* Increased margin */
  max-width: 300px; /* Adjusted max-width */
  margin-left: auto;
  margin-right: auto;
  color: #6a6a6a;
  margin-bottom: 8px; /* Increased margin */
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share {
  margin-right: 8px; /* Spacing between icon and text */
}

.custom-button {
  width: 150px; /* Increased width */
  height: 48px; /* Increased height */
  border-radius: 112px;
  opacity: 1;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  color: #ffffff;
  background-color: #e13a4b;
}

.share {
  width: 18px; /* Adjusted width */
  height: 20px; /* Adjusted height */
}

.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure modal is on top */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 90%; /* Adjust as needed */
  max-height: 90%; /* Adjust as needed */
  overflow: auto; /* Enable scrolling if content exceeds modal size */
  position: relative; /* Ensure relative positioning for absolute button */
}
.modal-content h2 {
  font-size: 24px; /* Adjust font size */
  font-weight: 700; /* Adjust font weight */
  margin-bottom: 16px; /* Add spacing below the heading */
  color: #333; /* Text color */
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

@media screen and (max-width: 320px) {
  .notification {
    width: 90%;
    max-width: 300px;
    margin: 0 auto;
  }

  .custom-text {
    font-size: 14px; /* Adjusted font size */
    line-height: 20px; /* Adjusted line height */
    height: auto;
    margin-top: 16px; /* Increased margin */
  }
}

</style>
