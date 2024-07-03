<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <HeaderStampQuestionUser :numberOfQuestions="5" :currentQuestion="5" />
    <div class="quiz-body">
      <div class="result-section">
        <div class="result-text">結果</div>
        <div class="score">5/6</div>
        <div class="count-right-answer">トータルスコア：5</div>
        <img src="@/assets/images/question-result.svg" />
        <div class="message">おつかれさま！キミは何問正解できたかな？？</div>
        <button class="download-button" @click="share" >デジタル認定画像をダウンロード</button>
      </div>
      <div class="share-section">
        <div class="share-text">結果をみんなにシェアしよう！</div>

        <div v-if="showShareModal" class="share-modal" @click="closeOnOutsideClick">
          <div class="modal-content" @click.stop>
            <h2>Select your social</h2>
            <button @click="closeShareModal" class="close-button">X</button>
            <div class="flex flex-wrap justify-between gap-2">
              <div v-for="network in ['facebook', 'linkedin', 'email', 'pinterest', 'whatsapp', 'telegram']"
                :key="network" class="social-share-item">
                <SocialShare :network="network" :styled="true" :label="false" :title="'Title of your share'"
                  :url="imageUrl" class="social-share-icon" />
                <span class="social-share-label">{{ network }}</span>
              </div>
            </div>
          </div>
        </div>
        

        <div class="share-link">
          <a href="https://jal-miraitower.jp/result" target="_blank" rel="noopener noreferrer">
            <span class="share-text">https://jal-miraitower.jp/result</span>
          </a>
          <img src="@/assets/images/copy-icon.svg" alt="Image" class="share-icon">
        </div>
        <div class="gray-background-footer">
          <div class="next-question">
            記念品の引き換えは、帰りの際に係の者にこのページをご提示してね！
          </div>
          <img src="@/assets/images/question-result-uemiya.svg" class="qr-code" />
        </div>
        
      </div>
    </div>
    <FooterQuestionUser />


  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import html2canvas from 'html2canvas';

const showShareModal = ref(false);
var imageUrl = ref('');

const share = async () => {
  try {
    await captureComponentAsImage(); // Chờ cho quá trình chụp và tải lên hoàn thành
    console.log(imageUrl.value);
    showShareModal.value = true; // Sau khi hoàn thành, hiển thị modal chia sẻ
  } catch (error) {
    console.error('Error while capturing and sharing:', error);
  }
};

const closeShareModal = () => {
  showShareModal.value = false;
};

const closeOnOutsideClick = (event) => {
  // Kiểm tra nếu nhấp ra ngoài modal-content thì đóng modal
  if (event.target.classList.contains('share-modal')) {
    closeShareModal();
  }
};

const captureComponentAsImage = async () => {
  const captureContainer = document.querySelector('.quiz-container'); // Chọn phần tử cần chụp ở đây

  try {
    const canvas = await html2canvas(captureContainer, {
      scale: 3,
      scrollX: 0,
      scrollY: 0,
      logging: true,
      letterRendering: true,
      allowTaint: true,
      useCORS: true
    });

    const imageData = canvas.toDataURL('image/png').split(',')[1]; // Lấy dữ liệu base64 từ imageData

    const apiKey = '710756e5d8714a4edc180eb163347fd5'; // Thay thế YOUR_API_KEY bằng API Key của bạn từ ImgBB
    // Tạo đối tượng FormData để gửi dữ liệu lên
    const formData = new FormData();
    formData.append('image', imageData);

    // Gửi yêu cầu POST đến ImgBB API
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Upload successful');
    console.log(response.data);

    // Lấy URL hình ảnh từ response và gán vào biến imageUrl
    imageUrl.value = response.data.data.url;

  } catch (error) {
    console.error('Error while capturing component:', error);
    throw new Error('Failed to capture component as image');
  }
};
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

.quiz-body {
  margin-top: 12px;
  flex-grow: 1; 
}

.count-right-answer {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
}

.result-text {
  font-family: Noto Sans JP;
  font-size: 24px;
  font-weight: 700;
  line-height: 34.75px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
}

.score {
  font-family: Noto Sans JP;
  font-size: 48px;
  font-weight: 700;
  line-height: 69.5px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #0082CA;
  margin-top: 12px;
}

.result-section img {
  width: 100%;
  max-width: 210px;
  margin: 10px 0;
}

.message {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  margin: 0 40px;
  margin-bottom: 12px;
}

.download-button {
  width: fit-content;
  height: fit-content;
  padding: 17px 38px;
  gap: 10px;
  border-radius: 49px;
  background-color:  #31D0AA;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #FFFFFF;
  border: none;
}

.share-section {
  padding: 17px 0px 17px 0px;
  gap: 20px;
}

.share-text {
  font-family: Noto Sans JP;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.27px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #97979F;
}

.share-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  padding: 10px 12px;
  gap: 10px;
  border-radius: 8px;
  background-color: #F1F4F9;
  margin: 10px auto;
  white-space: nowrap; /* Ngăn ngừa xuống dòng */
  overflow: hidden; /* Ẩn phần dư thừa */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi vượt quá */
}

.share-link a {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Noto Sans JP;
  font-size: 14px;
  font-weight: 700;
  line-height: 20.27px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #0082CA;
  text-decoration: none;
}

.share-text {
  flex: 1; /* Chỉnh sửa phần mở rộng của share-text */
  overflow: hidden; /* Ẩn phần dư thừa */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi vượt quá */
}

.share-icon {
  width: 32px;
  height: 32px;
  object-fit: cover; /* Đảm bảo ảnh vừa với kích thước khung hình */
  border-radius: 50%; /* Làm tròn góc */
  margin-right: 10px; /* Khoảng cách với liên kết */
}


.share-link a:hover {
  text-decoration: none;
}

.copy-icon {
  width: 32px;
  height: 32px;
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
