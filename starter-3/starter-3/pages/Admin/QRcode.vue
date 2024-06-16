<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
    </div>

    <div class="parent-component">
      <HeaderAddQuestion :id="7" />
    </div>

    <div class="body">
      <!-- Thêm class để hiển thị "質問" với ID câu hỏi -->
      <div class="question-label">質問 {{ localFloor }}</div>


      <!-- Thêm QR code và văn bản bên cạnh -->
      <div class="qr-code-container">
        <img src="@/assets/images/qr_code_red.svg" alt="QR Code" class="qr-code-image" />
        <div class="qr-code-text">QRコードを作成する</div>
      </div>

      <!-- Thêm hình vuông và hình Rectangle.svg -->
      <div class="qr-code-body">
        <div class="square">
          <img src="@/assets/images/Rectangle.svg" class="rectangle-top-left" />
          <img src="@/assets/images/Rectangle.svg" class="rectangle-top-right" />
          <img src="@/assets/images/Rectangle.svg" class="rectangle-bottom-left" />
          <img src="@/assets/images/Rectangle.svg" class="rectangle-bottom-right" />
          <!-- Thêm nút button -->
          <div v-if="!qrCodeUrl" class="button">
            <button class="center-button" @click="generateQRCode">
              <img src="@/assets/images/icon_plus_dark.svg" class="icon-plus" />
              <span class="button-text">新しく作る</span>
            </button>
          </div>
        </div>
        <img v-if="qrCodeGenerated" :src="qrCodeUrl" class="qr-code-result" />
      </div>

      <!-- Phần hiển thị QR code và download container -->
      <div class="qr-code-body">
        <!-- Hiển thị QR code khi đã tạo thành công -->

        <!-- Phần download container -->
        <div v-if="qrCodeGenerated" class="qr-download-container" @click="downloadQRCode">
          <img src="@/assets/images/download.svg" alt="Icon" class="qr-download-icon" />
          <div class="qr-download-text">QRコードをダウンロード</div>
        </div>
      </div>

<!-- Thêm button trong class generate -->
<div class="generate">
  <button class="generate-button generate-button-text" 
          @click="validateForm" 
          :disabled="generateButtonDisabled">
    完了
  </button>
</div>


    </div>
  </div>
</template>

<script>
import HeaderAddQuestion from "@/components/HeaderAddQuestion.vue";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  props: {
    questionId: {
      type: Number,
      //required: true,
    },
  },
  components: {
    HeaderAddQuestion,
  },

  setup() {
    // // Import AWS SDK
    // const AWS = require('aws-sdk');

    // // Cấu hình AWS SDK bằng cách cung cấp thông tin xác thực
    // AWS.config.update({
    //   accessKeyId: 'YOUR_ACCESS_KEY_ID',
    //   secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    //   region: 'ap-southeast-1', // ví dụ: 'ap-southeast-1'
    // });

    // // Tạo mới một đối tượng S3
    // const s3 = new AWS.S3();


    const router = useRouter();
    const questionId = ref(null); // Change to ref if you intend to use reactive state
    const qrCodeUrl = ref(null);
    const qrCodeGenerated = ref(false);
    const generateButtonDisabled = ref(true); // Initially disable the button

    const options = ref([]);
    const localFloor = ref(null);
    const qrcodeUrl = ref("");
    const bannerUrl = ref("");
    const footerUrl = ref("");
    const questionText = ref("");
    const correctAnswerExplain = ref("");
    const correctAnswerName = ref("");
    let id = ref(null);

    const time = parseInt(Date.now());

    // Gọi API tại đây để tạo QR code
    let adminQuestionIDCurrent = localStorage.getItem("adminQuestionIDCurrent");
    let host = "192.168.11.199:3000/quiz";
    let qrCodeData = `http://${host}/${time}`;

    let fileName = `qrcode_${time}.png`;
    let downloadPath = `C:/Users/thuyen.nm/Downloads/${fileName}`;

    const fetchQuestionData = () => {
      const savedData = localStorage.getItem('dataPayload');
      if (savedData) {
        try {
          const dataPayload = JSON.parse(savedData);
          localFloor.value = dataPayload.floor;
          qrcodeUrl.value = dataPayload.qrcode_url;
          questionText.value = dataPayload.question_name;
          correctAnswerExplain.value = dataPayload.correct_answer_explain;
          id.value = dataPayload.id;
          bannerUrl.value = dataPayload.banner_url;
          footerUrl.value = dataPayload.footer_url;
          correctAnswerName.value = dataPayload.correct_answer_name;
          options.value = Object.keys(dataPayload.options).map(key => ({
            text: dataPayload.options[key],
          }));

            // Check if qrcode_url is not null or empty
            if (dataPayload.qrcode_url && dataPayload.qrcode_url !== "") {
            qrCodeUrl.value = dataPayload.qrcode_url;
            qrCodeGenerated.value = true;
                  // Disable the button
            generateButtonDisabled.value = false;
          }
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      } else {
        console.log('No saved data found in local storage.');
      }
    };

    onMounted(() => {
      fetchQuestionData();
    });

    const generateQRCode = () => {


      fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCodeData)}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);

          // Tạo tên file với thời gian hiện tại

          // Create a temporary anchor element to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Log the URL for verification
          console.log('QR Code image URL:', downloadPath);

          // Lưu URL blob vào qrCodeUrl để sử dụng trong dataPayload
          qrCodeUrl.value = url;
          qrCodeGenerated.value = true; // Đánh dấu rằng QR code đã được tạo thành công

        })
        .catch((error) => {
          console.error("There has been a problem with your fetch operation:", error);
        })
        .finally(() => {
          generateButtonDisabled.value = false; // Re-enable the button after operation completes
        });
        console.log('QR Code image URL:', downloadPath);
    };


    const downloadQRCode = () => {
      // Kiểm tra nếu đã tạo QR code thành công và có URL của QR code
      if (qrCodeGenerated.value && qrCodeUrl.value) {
        // Tạo một thẻ a ẩn
        const link = document.createElement("a");
        link.href = qrCodeUrl.value;
        link.setAttribute('download', `qrcode_${time}.png`); // Set download attribute with dynamic file name
        // Thêm thẻ a vào body của trang
        document.body.appendChild(link);
        // Kích hoạt sự kiện click trên thẻ a để tải xuống
        link.click();
        // Xóa thẻ a sau khi đã tải xuống xong
        document.body.removeChild(link);
      }
    };

    const validateForm = async () => {
      const dataPayload = {
        question_name: questionText.value,
        correct_answer_explain: correctAnswerExplain.value,
        correct_answer_name: correctAnswerName.value,
        options: {
          option_1: options.value[0]?.text,
          option_2: options.value[1]?.text,
          option_3: options.value[2]?.text,
          option_4: options.value[3]?.text,
        },
        floor: parseInt(localFloor.value),
        qrcode_url: downloadPath,
        banner_url: bannerUrl.value,
        footer_url: footerUrl.value,
        id: parseInt(id.value)
      };



      const dataPayloadCopy = {
        question_name: questionText.value,
        correct_answer_explain: correctAnswerExplain.value,
        correct_answer_name: correctAnswerName.value,
        options: {
          option_1: options.value[0]?.text,
          option_2: options.value[1]?.text,
          option_3: options.value[2]?.text,
          option_4: options.value[3]?.text,
        },
        floor: parseInt(localFloor.value),
        qrcode_url: downloadPath,
        banner_url: bannerUrl.value,
        footer_url: footerUrl.value,
        id: time, // Chuyển đổi id.value thành kiểu integer
      };

      localStorage.setItem('dataPayload', JSON.stringify(dataPayload));

      const method = localStorage.getItem("method");
      try {
        if (method == "POST") {
          await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions', dataPayloadCopy);
        } else if (method == "PUT") {
          await axios.put('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions', dataPayload);
        }

        // Fetch the updated data
        const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
        // Process the response data if needed

        
        router.push({ path: "/Admin/MainPage" });
       // router.go(0);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }

    return {
      localFloor,
      questionId,
      qrCodeUrl,
      qrCodeGenerated,
      generateQRCode,
      downloadQRCode,
      validateForm,
      generateButtonDisabled, // Expose the disabled state to the template
    };
  },

};
</script>



<style scoped>
/* Banner */
.login-banner {
  background-color: #e13a4b;
  /* Màu đỏ */
  margin-top: 0px;
  width: 100%;
  /* Chiều rộng bằng 100% của trang */
  height: 56px;
  /* Chiều cao 56px */
}

/* Trang đăng nhập */
.login-page {
  background-color: #f9efe3;
  /* Màu nền */
  background-image: url("@/assets/images/background.svg");
  /* Hình nền */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  flex-direction: column;
  /* Sắp xếp theo chiều dọc */
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Chiều cao của toàn bộ trang */
  margin: 0;

  max-height: calc(100dvh);
  /* Set maximum height to 100 viewport height */
  overflow-y: auto;
  /* Enable vertical scrollbar */

  /* Hide scrollbar for WebKit browsers */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
}

.banner-text {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  color: white;
  /* Màu chữ trắng */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.parent-component {
  display: flex;
  justify-content: center;
  /* Căn giữa theo chiều ngang */
  align-items: center;
  /* Căn giữa theo chiều dọc */
  flex-direction: column;
  /* Sắp xếp theo chiều dọc */
  padding-top: 24px;
  padding-bottom: 24px;
}

/* Hiển thị questionId */
.question-id {
  font-size: 18px;
  margin-top: 20px;
}

/* CSS cho phần body */
.body {
  width: 819px;
  height: auto;
  /* Sử dụng chiều cao tự động để nội dung có thể mở rộng */
  padding: 24px;
  gap: 10px;
  border-radius: 16px;
  opacity: 0px;
  background: #ffffff;
  margin: 0 auto;
  /* Canh ra giữa theo chiều ngang */
  display: flex;
  /* Sử dụng flexbox để căn giữa button */
  flex-direction: column;
  /* Sắp xếp theo chiều dọc */
  justify-content: center;
  /* Căn giữa theo chiều dọc */
  align-items: center;
  /* Căn giữa theo chiều ngang */
}

/* Hiển thị "質問" với ID câu hỏi */
.question-label {
  width: fit-content;
  height: 36px;
  padding: 8px 12px;
  gap: 10px;
  border-radius: 44px;
  opacity: 1;
  background: #000000;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

/* CSS cho QR code container */
.qr-code-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

/* CSS cho hình ảnh QR code */
.qr-code-image {
  width: 24px;
  /* Điều chỉnh kích thước của hình ảnh QR code */
  height: 24px;
  margin-right: 8px;
  /* Khoảng cách giữa hình ảnh và văn bản */
}

/* CSS cho văn bản QR code */
.qr-code-text {
  font-family: "Noto Sans JP", sans-serif;
  /* Sử dụng font-family Noto Sans JP */
  font-size: 24px;
  /* Đặt kích thước font cho văn bản */
  font-weight: 500;
  /* Đặt độ đậm cho văn bản */
  line-height: 36px;
  /* Đặt chiều cao dòng cho văn bản */
  text-align: center;
  /* Căn giữa văn bản */
  color: #e13a4b;
  /* Đặt màu cho văn bản */
}

/* CSS cho phần body */
.qr-code-body {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

/* CSS cho hình vuông */
.square {
  position: relative;
  width: 180px;
  height: 180px;
}

/* CSS cho hình Rectangle */
.rectangle-top-left,
.rectangle-top-right,
.rectangle-bottom-left,
.rectangle-bottom-right {
  position: absolute;
  width: 52px;
  height: 52px;
}

.rectangle-top-left {
  top: 0;
  left: 0;
  transform: rotate(270deg);
}

.rectangle-top-right {
  top: 0;
  right: 0;
}

.rectangle-bottom-left {
  bottom: 0;
  left: 0;
  transform: rotate(180deg);
}

.rectangle-bottom-right {
  bottom: 0;
  right: 0;
  transform: rotate(90deg);
}

/* CSS cho nút button và biểu tượng */
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* Đảm bảo nút button chiếm toàn bộ chiều cao của phần bao bọc */
}

.center-button {
  width: fit-content;
  height: 40px;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Căn giữa cả văn bản và biểu tượng */
}

.icon-plus {
  width: 20px;
  height: 20px;
  margin: 10px 8px 10px 16px;
}

.button-text {
  font-family: "Noto Sans JP", sans-serif;
  /* Sử dụng font-family Noto Sans JP */
  font-size: 16px;
  /* Đặt kích thước font cho văn bản */
  font-weight: 500;
  /* Đặt độ đậm cho văn bản */
  line-height: 20px;
  /* Đặt chiều cao dòng cho văn bản */
  color: #1a1a1a;
  /* Đặt màu cho văn bản */
  margin-right: 24px;
}

.generate {
  display: flex;
  justify-content: center;
  margin-top: auto;
  /* Căn giữa phần .generate xuống dưới cùng */
  margin-bottom: 0px;
}

.generate-button {
  width: 196px;
  height: 56px;
  padding: 14px 24px;
  /* Điều chỉnh giá trị padding ở đây */
  gap: 10px;
  border-radius: 112px;
  background: #e13a4b;
  color: white;
  position: relative;
  /* Thêm thuộc tính position để có thể vị trí đường line */
}

.generate-button-text {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
}

/* CSS cho QR code result */
.qr-code-result {
  position: absolute;
  max-width: 150px;
  /* Đảm bảo QR code không vượt quá kích thước của phần tử cha */
  max-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* Đảm bảo nút button chiếm toàn bộ chiều cao của phần bao bọc */
}

/* Thêm media queries khác tùy thuộc vào các kịch bản sử dụng của bạn */

.qr-download-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  color: #6a6a6a;
  padding: 10px 20px;
  border-radius: 10px;
}

.qr-download-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.generate-button:disabled {
  background-color: #C8C8C8;
  /* Light red background when disabled */
  cursor: not-allowed;
  /* Show disabled cursor */
  opacity: 0.7;
  /* Reduce opacity when disabled */
}

.generate-button:disabled:hover {
  /* Optional: Adjust hover state when disabled */
  opacity: 0.7;
  background-color: #C8C8C8;
  ;
}
</style>
