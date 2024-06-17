<template>
  <div ref="captureContainer">
    <div class="notification">
      <div class="notification-content">
        <div class="notification-items">
          <div class="svg-container">
            <img src="@/assets/images/cloud_left.svg" class="svg-image left" alt="Cloud Left" />
          </div>
          <div class="question-text">結果です</div>
          <div class="svg-container">
            <img src="@/assets/images/cloud_right.svg" class="svg-image right" alt="Cloud Right" />
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
          <h2>Share social</h2>
          <div class="flex flex-row gap-2">
            <SocialShare v-for="network in ['facebook', 'linkedin', 'email', 'pinterest', 'whatsapp', 'telegram']"
              :key="network" :network="network" :styled="true" :label="false" :title="'Title of your share'"
              :url="imageUrl" class="p-4 rounded-none" />

          </div>
          <button @click="closeShareModal" class="close-button">X</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import NavigatorShare from "vue-navigator-share";
import html2canvas from 'html2canvas';
import axios from 'axios';

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
      imageUrl: '',
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
    async share() {
      try {
        await this.captureComponentAsImage(); // Chụp và upload hình ảnh
        // Sau khi capture và upload thành công, thiết lập showShareModal = true
      } catch (error) {
        console.error('Error while capturing and sharing:', error);
        this.onError('Failed to share the image');
      }
    },

    closeShareModal() {
      this.showShareModal = false; // Close the modal
    },
    captureComponentAsImage() {
      const captureContainer = this.$refs.captureContainer;

      html2canvas(captureContainer, {
        scale: 3,
        scrollX: 0,
        scrollY: 0,
        logging: true,
        letterRendering: true,
        allowTaint: true,
        useCORS: true
      }).then(canvas => {
        const imageData = canvas.toDataURL('image/png').split(',')[1]; // Lấy phần base64 từ imageData

        const apiKey = '710756e5d8714a4edc180eb163347fd5'; // Thay thế YOUR_API_KEY bằng API Key của bạn từ ImgBB
        // Tạo đối tượng FormData để gửi dữ liệu lên
        const formData = new FormData();
        formData.append('image', imageData);

        // Gửi yêu cầu POST đến ImgBB API
        axios.post('https://api.imgbb.com/1/upload?key=' + apiKey, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log('Upload successful');
            console.log(response.data);

            // Lấy URL hình ảnh từ response và gán vào biến this.imageUrl
            this.imageUrl = response.data.data.url;

            console.log("ád", this.imageUrl);

            // Sau khi có URL, hiển thị modal chia sẻ
            this.showShareModal = true;
          })
          .catch(error => {
            console.error('Error uploading image:', error);
          });


      }).catch(error => {
        console.error('Error while capturing component:', error);
        this.onError('Failed to capture component as image');
      });
    },
  }
};
</script>

<style scoped>
.notification {
  display: flex;
  flex-direction: column;
  width: 343px;
  height: auto;
  padding: 24px 16px 32px 16px;
  border-radius: 16px;
  border: 2px solid #ffffff;
  background-color: #ffffff;
}

.notification .custom-button {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.notification-content {
  position: relative;
  margin-bottom: 32px;
}

.notification-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 12px;
}

.question-text {
  margin-top: 10px;
  opacity: 1;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #e13a4b;
}

.text {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
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
  margin-top: 32px;
}

.correct-answer {
  width: 160px;
  height: 50px;
  padding: 12px 48px;
  opacity: 1;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
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
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  margin-top: 24px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  color: #6a6a6a;
  margin-bottom: 8px;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share {
  margin-right: 8px;
}

.custom-button {
  width: 150px;
  height: 48px;
  border-radius: 112px;
  opacity: 1;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  color: #ffffff;
  background-color: #e13a4b;
}

.share {
  width: 18px;
  height: 20px;
}

.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  position: relative;
}

.modal-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
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
    font-size: 14px;
    line-height: 20px;
    height: auto;
    margin-top: 16px;
  }

  .social-share-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
}
</style>
