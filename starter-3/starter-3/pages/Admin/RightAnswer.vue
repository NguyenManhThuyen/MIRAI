<template>
    <div class="login-page">
      <div class="login-banner">
        <div class="banner-text">ル・ヴァン・サン</div>
      </div>
      
      <div class="parent-component">
        <HeaderAddQuestion :id="3"/>
      </div>
  
      <div class="body">
        <!-- Thêm class để hiển thị "質問" với ID câu hỏi -->
        <div class="question-label">質問 {{ questionId }}</div>
  
        <!-- Thêm QR code và văn bản bên cạnh -->
        <div class="qr-code-container">
          <img src="@/assets/images/assignment-turned-in-red.svg" alt="QR Code" class="qr-code-image">
          <div class="qr-code-text">正しい答えを選択してください</div>
        </div>
  
        <!-- Thêm phần danh sách các オプション-->
        <div class="answer-list">
          <label class="answer-item">
            <input type="radio" name="answer" value="1" checked>
            <span class="answer-text">オプション1</span>
          </label>
          
          <label class="answer-item">
            <input type="radio" name="answer" value="2">
            <span class="answer-text">オプション2</span>
          </label>
          <label class="answer-item">
            <input type="radio" name="answer" value="3">
            <span class="answer-text">オプション3</span>
          </label>
          <label class="answer-item">
            <input type="radio" name="answer" value="4">
            <span class="answer-text">オプション4</span>
          </label>
        </div>
  
        <!-- Thêm button trong class generate -->
        <div class="generate">
          <nuxt-link to="/Admin/DescriptionAnswer" class="generate-button generate-button-text">次に</nuxt-link>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  import HeaderAddQuestion from '@/components/HeaderAddQuestion.vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      HeaderAddQuestion,
    },
    setup() {
      const router = useRouter();
      const questionId = router.currentRoute.value.query.id ? parseInt(router.currentRoute.value.query.id) : null;
  
      const saveAnswer = () => {
        // Lấy giá trị của オプションđã chọn
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
          const selectedValue = selectedAnswer.value;
          // Thực hiện xử lý lưu オプションđã chọn vào cơ sở dữ liệu hoặc thực hiện hành động khác
          console.log('オプションđã chọn:', selectedValue);
        } else {
          // Hiển thị thông báo nếu không có オプションnào được chọn
          console.log('Vui lòng chọn một câu trả lời');
        }
      };
  
      return {
        questionId,
        saveAnswer,
      };
    },
  };
  </script>

  
  <style scoped>
    /* Banner */
    .login-banner {
      background-color: #E13A4B; /* Màu đỏ */
      margin-top: 0px;
      width: 100%; /* Chiều rộng bằng 100% của trang */
      height: 56px; /* Chiều cao 56px */
    }
    
    /* Trang đăng nhập */
    .login-page {
      background-color: #F9EFE3; /* Màu nền */
      background-image: url('@/assets/images/background.svg'); /* Hình nền */
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      flex-direction: column; /* Sắp xếp theo chiều dọc */
      justify-content: center;
      align-items: center;
      height: 100vh; /* Chiều cao của toàn bộ trang */
      margin: 0;
    }
  
    .banner-text {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 23.17px;
      text-align: center;
      color: white; /* Màu chữ trắng */
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  
    .parent-component {
      display: flex;
      justify-content: center; /* Căn giữa theo chiều ngang */
      align-items: center; /* Căn giữa theo chiều dọc */
      flex-direction: column; /* Sắp xếp theo chiều dọc */
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
    height: auto; /* Sử dụng chiều cao tự động để nội dung có thể mở rộng */
    padding: 24px;
    gap: 10px;
    border-radius: 16px;
    opacity: 0px;
    background: #FFFFFF;
    margin: 0 auto; /* Canh ra giữa theo chiều ngang */
    display: flex; /* Sử dụng flexbox để căn giữa button */
    flex-direction: column; /* Sắp xếp theo chiều dọc */
    justify-content: center; /* Căn giữa theo chiều dọc */
    align-items: center; /* Căn giữa theo chiều ngang */
  }
  
    /* Hiển thị "質問" với ID câu hỏi */
    .question-label {
      width: 60px;
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
      margin-bottom: 12px;
    }
  
    /* CSS cho hình ảnh QR code */
    .qr-code-image {
      width: 24px; /* Điều chỉnh kích thước của hình ảnh QR code */
      height: 24px;
      margin-right: 8px; /* Khoảng cách giữa hình ảnh và văn bản */
    }
  
    /* CSS cho văn bản QR code */
    .qr-code-text {
      font-family: 'Noto Sans JP', sans-serif; /* Sử dụng font-family Noto Sans JP */
      font-size: 24px; /* Đặt kích thước font cho văn bản */
      font-weight: 500; /* Đặt độ đậm cho văn bản */
      line-height: 36px; /* Đặt chiều cao dòng cho văn bản */
      text-align: center; /* Căn giữa văn bản */
      color: #E13A4B; /* Đặt màu cho văn bản */
    }
  
  /* CSS cho nút button và biểu tượng */
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* Đảm bảo nút button chiếm toàn bộ chiều cao của phần bao bọc */
  }
  
  .center-button {
    width: fit-content;
    height: 40px;
    gap: 8px;
    border-radius: 12px;
    border: 1px solid #1A1A1A;
    display: flex;
    align-items: center;
    justify-content: center; /* Căn giữa cả văn bản và biểu tượng */
  }
  
  .icon-plus {
    width: 20px;
    height: 20px;
    margin: 10px 8px 10px 16px;
  }
  
  .button-text {
    font-family: 'Noto Sans JP', sans-serif; /* Sử dụng font-family Noto Sans JP */
    font-size: 16px; /* Đặt kích thước font cho văn bản */
    font-weight: 500; /* Đặt độ đậm cho văn bản */
    line-height: 20px; /* Đặt chiều cao dòng cho văn bản */
    color: #1A1A1A; /* Đặt màu cho văn bản */
    margin-right: 24px;
  }
  
    .generate {
        display: flex;
        justify-content: center;
        margin-top: auto; /* Căn giữa phần .generate xuống dưới cùng */
        margin-bottom: 0px;
    }
    
    .generate-button {
        width: 196px;
        height: 56px;
        padding: 14px 24px; /* Điều chỉnh giá trị padding ở đây */
        gap: 10px;
        border-radius: 112px;
        background: #E13A4B;
        color: white;
    }
    
    
  .generate-button-text {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    text-align: center;
  }
  
  .answer-list {
    display: flex;
    flex-direction: column;
  }
  
   /* Thêm border màu xám 1px giữa các オプション*/
   .answer-item {
    border: 1px solid #ccc;
    border-radius: 112px; /* Sử dụng border-radius để tạo border cong */
    margin-bottom: 8px;
  }
  
  /* Thiết lập kiểu của input radio */
  .answer-item input[type="radio"] {
    display: none; /* Ẩn input radio mặc định */
  }
  
  /* Tùy chỉnh kiểu của input radio đã chọn */
  .answer-item input[type="radio"]:checked + span {
    background: #31D0AA; /* Đổi màu nền khi đã chọn */
    color: white; /* Đổi màu văn bản khi đã chọn */
  }
  
  /* Thiết lập kiểu của label */
  .answer-item span {
    cursor: pointer;
    display: inline-block;
    background: white;
    width: 771px;
    height: 56px;
    padding: 16.36px 24px 15.64px 24px;
    gap: 0px;
    border-radius: 112px;
    opacity: 0px;
  }
/* Thêm dấu check từ ảnh check.svg */
.answer-item input[type="radio"]:checked + span {
    background: #31D0AA;
    color: white;
    position: relative;
    }

    .answer-item input[type="radio"]:checked + span::after {
    content: url('@/assets/images/check.svg');
    position: absolute;
    top: 50%;
    right: 10px; /* Điều chỉnh vị trí dấu check */
    transform: translateY(-50%);
    width: 20px; /* Điều chỉnh kích thước dấu check */
    height: 20px;
    }
  
  </style>
  