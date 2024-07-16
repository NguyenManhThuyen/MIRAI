<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <HeaderStampQuestionUser :color="true" :admin="true"/>
    <div class="quiz-body">
      <div class="result-section">
        <div class="result-text">結果</div>
        <div class="score">{{ correctAnswers }}/{{ totalQuestions }}</div>
        <div class="count-right-answer">トータルスコア：{{ correctAnswers }}</div>        
        <img src="@/assets/images/question-result.svg"/>
        <div class="message">おつかれさま！キミは何問正解できたかな？？</div>
        <button class="download-button" @click="share" >デジタル認定画像をダウンロード</button>
      </div>
      <div class="share-section">
        <div class="share-text">結果をみんなにシェアしよう！</div>

        <div class="social-share-container">
          <div v-for="network in ['facebook', 'twitter', 'line', 'email']" :key="network" class="social-share-item">
            <SocialShare :network="network" :styled="true" :label="false" :title="'Title of your share'"
                         :url="imageUrl" class="social-share-icon gray-icon" />
          </div>
        </div>
        

        <div class="share-link">
          <a :href="imageUrl" target="_blank" rel="noopener noreferrer">
            <span class="share-text-link">{{ imageUrl }}</span>
          </a>
          <input type="text" ref="inputToCopy" class="input-to-copy" :value="imageUrl" style="opacity: 0; position: absolute; left: -9999px;">
          <img src="@/assets/images/copy-icon.svg" class="copy-icon" @click="copyInputValue">
        </div>
        
        <div class="gray-background-footer" v-if="shouldShowFooter">
          <div class="next-question">
            {{subtitle}}
          </div>
          <img src="@/assets/images/question-result-uemiya.svg" class="qr-code" />
        </div>
        
      </div>
    </div>
    <FooterQuestionUser />


  </div>
</template>

<script setup>
import { ref,watchEffect  } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import html2canvas from 'html2canvas';
const router = useRouter();
const showShareModal = ref(false);
const totalQuestions = ref(0);
const correctAnswers = ref(0);
const shouldShowFooter = ref(true); // Default to true
const subtitle = ref('');
var imageUrl = ref('');
const results = ref([]);    
const storedResults = localStorage.getItem('results');
if (storedResults) {
  results.value = JSON.parse(storedResults);
}
// Tính toán số lượng câu hỏi
totalQuestions.value = results.value.length;

// Tính toán số câu trả lời đúng
correctAnswers.value = results.value.filter(result => result.status === true).length;

const share = async () => {
  try {
    //showShareModal.value = true; // Hiển thị modal chia sẻ
    router.push('/users/questionStamp');
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

const inputToCopy = ref(null);
const copyInputValue = () => {
  const inputElement = unref(inputToCopy);
  if (inputElement) {
    inputElement.select();
    document.execCommand('copy');
  }
};


onMounted(async () => {
  const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/2');
    console.log(response.data.noti);
    if (response.data.noti === null || !response.data.noti) {
      shouldShowFooter.value = false; // Hide footer
    } else {
      subtitle.value = response.data.content;
    }
  await captureComponentAsImage(); // Chờ cho quá trình chụp và tải lên hoàn thành
  console.log(imageUrl.value);
});

watchEffect(async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/2');
    console.log(response.data);
    if (response.data.noti === null || !response.data.content) {
      shouldShowFooter.value = false; // Ẩn footer
    } else {
      subtitle.value = response.data.content;
    }
  } catch (error) {
    console.error('Error in watchEffect:', error);
    // Xử lý lỗi ở đây nếu cần thiết
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
.gray-icon {
  display: flex;
  gap: 10px; /* Khoảng cách giữa các icon */
  filter: grayscale(100%); /* Thay đổi màu icon thành màu xám */
  background-color: transparent !important; /* Bỏ màu nền */
  color: #4B4B4D;
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
  transition: transform 0.5s ease-in-out; /* Thêm hiệu ứng transition */
}

.share-section {
  padding: 17px 0px 17px 0px;
  gap: 20px;
}

.social-share-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.social-share-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  transform: scale(1.33); /* Tăng kích thước của icon */
}

.share-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  gap: 10px;
  border-radius: 8px;
  background-color: #F1F4F9;
  margin: 10px auto;
  white-space: nowrap; /* Ngăn ngừa xuống dòng */
  overflow: hidden; /* Ẩn phần dư thừa */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi vượt quá */
  flex: 1; /* Giãn ra toàn bộ phần tử flex container */
  margin-left: 16px;
  margin-right: 16px;
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
  white-space: nowrap; /* Ngăn không cho dòng bị wrap */
  overflow: hidden; /* Ẩn nội dung bị tràn */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi bị cắt */
}

.share-text-link {
  display: flex;
  font-family: Noto Sans JP;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.27px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #97979F;
  flex: 1; /* Giãn ra toàn bộ phần tử flex container */
  white-space: nowrap; /* Ngăn không cho dòng bị wrap */
  overflow: hidden; /* Ẩn nội dung bị tràn */
  text-overflow: ellipsis; /* Hiển thị dấu ba chấm (...) khi bị cắt */
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
  cursor: pointer; /* Đổi con trỏ chuột thành pointer khi di chuột vào */
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}
.download-button:hover,
.copy-icon:hover {
  transform: scale(1.2); /* Phóng to khi di chuột vào */
}
.download-button:active,
.copy-icon:active {
  transform: scale(0.9); /* Thu nhỏ khi click vào */
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
