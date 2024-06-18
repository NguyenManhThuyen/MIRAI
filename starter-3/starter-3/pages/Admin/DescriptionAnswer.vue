<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
      <div class="logout-button" @click="logout">ログアウト</div>
    </div>

    <div class="parent-component">
      <HeaderAddQuestion :id="5" />
    </div>

    <div class="body">
      <!-- Thêm class để hiển thị "質問" với ID câu hỏi -->
      <div class="question-label">質問 {{ this.localFloor }}</div>

      <!-- Thêm QR code và văn bản bên cạnh -->
      <div class="qr-code-container">
        <img src="@/assets/images/question-answer-red.svg" alt="QR Code" class="qr-code-image">
        <div class="qr-code-text">質問に答えて</div>
      </div>
      <h2>{{ this.correctAnswerOption}}</h2>

      <!-- Thêm phần overlay để nhập văn bản -->
      <div class="bodyy">
        <img src="@/assets/images/innner_alinement.svg" alt="body" class="body_inner">
        <div class="text-overlay">
          <textarea v-model="userInput" placeholder="ここにテキストを入力してください"></textarea>
          <!-- Hiển thị thông báo lỗi nếu input rỗng -->
        </div>
      </div>
      <div v-if="inputError" class="error-message">まだ回答の説明を入力していません</div>
      <!-- Thêm button trong class generate -->
      <div class="generate">
        <button class="generate-button generate-button-text" @click="submitUserInput">次に</button>
      </div>
    </div>

  </div>
</template>


<script>
import HeaderAddQuestion from '@/components/HeaderAddQuestion.vue';
import axios from "axios";

export default {
  components: {
    HeaderAddQuestion,
  },
  data() {
    return {
      userInput: '', // Dữ liệu người dùng nhập vào
      inputError: false, // Biến để kiểm tra trạng thái lỗi
      localFloor: null,
      questionText: "", // Placeholder for the question text
      id: "", // Placeholder for the question ID
      correctAnswerName: "", // Placeholder for correct answer name
      correctAnswerExplain: "", // Placeholder for correct answer explanation
      options: [], // Initialize options as an empty array
      qrcodeUrl: "", // Placeholder for QR code URL
      bannerUrl :"",
      footerUrl :"",
      createdAt: "", // Placeholder for created at timestamp
      updatedAt: "", // Placeholder for updated at timestamp
      selectedOption: null, // Placeholder for selected option
      correctAnswerOption: "",
    };
  },
  mounted() {
  this.fetchQuestionData();
  if (localStorage.getItem("loginStatus") != "true") {
      // Navigate to /Admin/Login
      this.$router.push('/Admin/Login');
    }
},


  methods: {
    logout() {
      // Perform logout actions here (if any)
localStorage.setItem("loginStatus", "false");
      // Navigate to /Admin/Login
      this.$router.push('/Admin/Login');
    },
    submitUserInput() {
      if (this.userInput.trim() === '') {
        this.inputError = true; // Nếu input rỗng, hiển thị thông báo lỗi
      } else {
        this.inputError = false; 

        this.correctAnswerExplain = this.userInput.trim();
        
        const dataPayload = {
          question_name: this.questionText,
          correct_answer_explain: this.correctAnswerExplain,
          correct_answer_name: this.correctAnswerName,
          options: {
            option_1: this.options[0].text,
            option_2: this.options[1].text,
            option_3: this.options[2].text,
            option_4: this.options[3].text,
          },
          floor: this.localFloor,
          banner_url: this.bannerUrl,
          footer_url: this.footerUrl,
          qrcode_url: this.qrcodeUrl,
          id: this.id
        };
        localStorage.setItem('dataPayload',JSON.stringify(dataPayload));
        this.$router.push(`/Admin/QRcode`);

      }
    },
    async fetchQuestionData() {
    // Lấy dữ liệu từ local storage
    const savedData = localStorage.getItem('dataPayload');

    // Kiểm tra nếu có dữ liệu đã lưu
    if (savedData) {
      try {
        // Chuyển đổi từ chuỗi JSON thành đối tượng JavaScript
        const dataPayload = JSON.parse(savedData);

        // Sử dụng dữ liệu payload như bạn cần
        console.log('Retrieved dataPayload:', dataPayload);

        // Populate data from localStorage into component data properties
        this.localFloor = dataPayload.floor;
        this.qrcodeUrl = dataPayload.qrcode_url;
        this.questionText = dataPayload.question_name;
        this.id = dataPayload.id;
        this.correctAnswerOption = localStorage.getItem('AnswerDataPayload');
        this.bannerUrl = dataPayload.banner_url;
        this.footerUrl = dataPayload.footer_url;
        // Convert options object to array and assign to this.options
        this.options = Object.keys(dataPayload.options).map((key) => ({
          text: dataPayload.options[key],
        }));

        // Example of assigning correct answer data
        this.correctAnswerName = dataPayload.correct_answer_name;
        this.correctAnswerExplain = dataPayload.correct_answer_explain;
        // Optionally, you can perform additional assignments as needed
        this.userInput = this.correctAnswerExplain
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    } else {
      console.log('No saved data found in local storage.');
    }
  }

  },

};
</script>


<style scoped>
/* Banner */
.login-banner {
  display: flex;
  background-color: #E13A4B;
  /* Màu đỏ */
  margin-top: 0px;
  width: 100%;
  /* Chiều rộng bằng 100% của trang */
  height: 56px;
  /* Chiều cao 56px */
}

/* Trang đăng nhập */
.login-page {
  background-color: #F9EFE3;
  /* Màu nền */
  background-image: url('@/assets/images/background.svg');
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

  max-height: calc(100dvh); /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */

    /* Hide scrollbar for WebKit browsers */
    scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

.banner-text {
  font-family: 'Noto Sans JP', sans-serif;
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
  margin-left: 100px;
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


/* CSS cho phần body */
.body {
  width: 819px;
  height: auto;
  /* Sử dụng chiều cao tự động để nội dung có thể mở rộng */
  padding: 24px;
  gap: 10px;
  border-radius: 16px;
  opacity: 0px;
  background: #FFFFFF;
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
  margin-bottom: 16px;
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
  font-family: 'Noto Sans JP', sans-serif;
  /* Sử dụng font-family Noto Sans JP */
  font-size: 24px;
  /* Đặt kích thước font cho văn bản */
  font-weight: 500;
  /* Đặt độ đậm cho văn bản */
  line-height: 36px;
  /* Đặt chiều cao dòng cho văn bản */
  text-align: center;
  /* Căn giữa văn bản */
  color: #E13A4B;
  /* Đặt màu cho văn bản */
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
  border: 1px solid #1A1A1A;
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
  font-family: 'Noto Sans JP', sans-serif;
  /* Sử dụng font-family Noto Sans JP */
  font-size: 16px;
  /* Đặt kích thước font cho văn bản */
  font-weight: 500;
  /* Đặt độ đậm cho văn bản */
  line-height: 20px;
  /* Đặt chiều cao dòng cho văn bản */
  color: #1A1A1A;
  /* Đặt màu cho văn bản */
  margin-right: 24px;
  margin-left: 100px;
}

/* CSS cho phần .generate */
.generate {
  width: 819px;
  /* Sử dụng cùng chiều rộng với phần .body */
  display: flex;
  justify-content: center;
  margin-top: auto;
  /* Căn giữa phần .generate xuống dưới cùng */
  margin-bottom: 0px;
  padding: 0 24px 16px;
  /* Padding 24px ở trái và phải, 16px ở dưới */
  position: relative;
  /* Đặt position là relative */
}


/* CSS cho nút button */
.generate-button {
  margin-top: 17px;
  width: 100%;
  /* Chiếm toàn bộ chiều rộng của phần .generate */
  height: 56px;
  padding: 14px 24px;
  /* Điều chỉnh giá trị padding ở đây */
  gap: 10px;
  border-radius: 112px;
  background: #E13A4B;
  color: white;
  max-width: 196px;
  position: relative;
  /* Đặt position là relative */
}


/* CSS cho nút button và biểu tượng trong .generate */
.generate .generate-button {
  width: 100%;
  /* Chiếm toàn bộ chiều rộng của phần .generate */
  height: 56px;
  padding: 14px 24px;
  /* Điều chỉnh giá trị padding ở đây */
  gap: 10px;
  border-radius: 112px;
  background: #E13A4B;
  color: white;
  max-width: 196px;
}


.generate-button-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
}

/* CSS cho phần h2 */
.body h2 {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  text-align: center;
  color: #E13A4B;
  width: fit-content;
  height: auto;
  padding: 10.36px 0;
  border-top: 1px solid #DADADA;
  /* Chỉ định border cạnh trên */
  border-bottom: 1px solid #DADADA;
  /* Chỉ định border cạnh dưới */
}

.bodyy {
  position: relative;
}

.body_inner {
  position: relative;
  /* Đặt position là relative */
  display: block;
  width: 100%;
}

/* CSS cho phần overlay văn bản */
.text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-overlay textarea {
  border: none; /* Xóa đường viền */
  outline: none; /* Xóa đường viền nổi */
  width: 100%; /* Đảm bảo textarea đầy đủ chiều rộng */
  padding: 10px; /* Tăng đệm nếu cần thiết */
  resize: none; /* Ngăn người dùng thay đổi kích thước */
  /* Thêm các thuộc tính CSS khác tùy vào thiết kế của bạn */
}

.text-overlay span {
  font-size: 16px;
  /* Điều chỉnh kích thước font cho văn bản */
  color: #FFFFFF;
  /* Đặt màu cho văn bản */
  text-align: center;
  /* Căn giữa văn bản */
  padding: 20px;
  /* Điều chỉnh padding cho văn bản */
  background-color: rgba(0, 0, 0, 0.5);
  /* Màu nền của văn bản */
}

.text-overlay textarea {
  width: 100%;
  /* Chiều rộng 100% của vùng text overlay */
  height: 100%;
  /* Chiều cao 100% của vùng text overlay */
  resize: none;
  /* Ngăn chặn việc thay đổi kích thước của textarea */
  border: none;
  /* Loại bỏ viền của textarea */
  background: transparent;
  /* Nền trong suốt cho textarea */
  color: rgb(0, 0, 0);
  /* Màu chữ của văn bản */
  font-size: 16px;
  /* Kích thước font chữ */
  padding: 20px;
  /* Khoảng cách giữa văn bản và biên của textarea */
  line-height: 1.5;
  /* Chiều cao dòng */
  box-sizing: border-box;
  /* Đảm bảo kích thước của textarea không bị thay đổi bởi padding và border */
}

.error-message {
  color: red;
  /* Màu chữ đỏ */
  font-size: 14px;
  /* Kích thước font nhỏ */
  margin-top: 12px;
  /* Khoảng cách giữa input và thông báo lỗi */
  text-align: center;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  letter-spacing: 0.02em;

}

.logout-button {
  width: 100px;
  display: flex; /* Sửa 'flexbox' thành 'flex' */
  color: white; /* Màu chữ trắng */
  white-space: nowrap; /* Ngăn không cho văn bản ngắt dòng */
  align-items: center; /* Căn giữa nội dung theo trục dọc nếu có các phần tử con */
  justify-content: center; /* Căn giữa nội dung theo trục ngang nếu có các phần tử con */
  padding: 10px 20px; /* Thêm padding cho button */
  background-color: #E13A4B; /* Màu nền (có thể thay đổi theo nhu cầu) */
  border: none; /* Loại bỏ đường viền */
  border-radius: 25px; /* Tạo góc bo tròn cho button */
  cursor: pointer; /* Hiển thị con trỏ khi hover */
  font-family: 'Noto Sans JP', sans-serif; /* Font chữ (thay đổi theo nhu cầu) */
  font-size: 16px; /* Kích thước chữ (thay đổi theo nhu cầu) */
  transition: background-color 0.3s; /* Thêm hiệu ứng chuyển đổi màu nền khi hover */
}

.logout-button:hover {
  background-color: #c12a3b; /* Màu nền khi hover (có thể thay đổi theo nhu cầu) */
}
/* Responsive CSS for screens up to 768px */
@media (max-width: 768px) {
  .login-banner {
    height: 52px;
  }
  .banner-text {
    font-size: 18px;
    margin-left: 120px;
  }
  .logout-button {
    width: 110px;
    font-size: 16px;
    padding: 12px 24px;
  }
  .body {
    width: 100%;
    padding: 20px;
  }
  .question-label {
    font-size: 16px;
    height: 40px;
  }
  .qr-code-text {
    font-size: 22px;
  }
  .generate-button {
    width: 100%;
    height: 60px;
    padding: 16px 28px;
    max-width: 220px;
  }
  .generate-button-text {
    font-size: 18px;
  }
  .body h2 {
    font-size: 24px;
  }
  .error-message {
    font-size: 16px;
  }
}

/* Responsive CSS for screens up to 576px */
@media (max-width: 576px) {
  .login-banner {
    height: 48px;
  }
  .banner-text {
    font-size: 16px;
    margin-left: 100px;
  }
  .logout-button {
    width: 90px;
    font-size: 14px;
    padding: 10px 20px;
  }
  .body {
    width: 100%;
    padding: 16px;
  }
  .question-label {
    font-size: 14px;
    height: 36px;
  }
  .qr-code-text {
    font-size: 18px;
  }
  .generate-button {
    width: 100%;
    height: 44px;
    padding: 14px 24px;
    max-width: 196px;
  }
  .generate-button-text {
    font-size: 16px;
  }
  .body h2 {
    font-size: 20px;
  }
  .error-message {
    font-size: 14px;
  }
}

/* Responsive CSS for screens up to 480px */
@media (max-width: 480px) {
  .login-banner {
    height: 40px;
  }
  .banner-text {
    font-size: 14px;
    margin-left: 80px;
  }
  .logout-button {
    width: 80px;
    font-size: 12px;
    padding: 8px 16px;
  }
  .body {
    width: 100%;
    padding: 12px;
  }
  .question-label {
    font-size: 12px;
    height: 32px;
  }
  .qr-code-text {
    font-size: 16px;
  }
  .generate-button {
    width: 100%;
    height: 40px;
    padding: 10px 20px;
    max-width: 160px;
  }
  .generate-button-text {
    font-size: 14px;
  }
  .body h2 {
    font-size: 18px;
  }
  .error-message {
    font-size: 12px;
  }
}

/* Responsive CSS for screens up to 320px */
@media (max-width: 320px) {
  .login-banner {
    height: 36px;
  }
  .banner-text {
    font-size: 12px;
    margin-left: 60px;
  }
  .logout-button {
    width: 70px;
    font-size: 10px;
    padding: 6px 12px;
  }
  .body {
    width: 100%;
    padding: 8px;
  }
  .question-label {
    font-size: 10px;
    height: 28px;
  }
  .qr-code-text {
    font-size: 14px;
  }
  .generate-button {
    width: 100%;
    height: 36px;
    padding: 6px 12px;
    max-width: 140px;
  }
  .generate-button-text {
    font-size: 12px;
  }
  .body h2 {
    font-size: 16px;
  }
  .error-message {
    font-size: 10px;
  }
}

</style>