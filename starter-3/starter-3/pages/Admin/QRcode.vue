<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
    </div>
    
    <div class="parent-component">
      <HeaderAddQuestion :id="1"/>
    </div>

    <div class="body">
      <!-- Thêm class để hiển thị "質問" với ID câu hỏi -->
      <div class="question-label">質問 {{ questionId }}</div>

      <!-- Thêm QR code và văn bản bên cạnh -->
      <div class="qr-code-container">
        <img src="@/assets/images/qr_code_red.svg" alt="QR Code" class="qr-code-image">
        <div class="qr-code-text">QRコードを作成する</div>
      </div>

      <!-- Thêm hình vuông và hình Rectangle.svg -->
      <div class="qr-code-body">
        <div class="square">
          <img src="@/assets/images/Rectangle.svg" class="rectangle-top-left">
          <img src="@/assets/images/Rectangle.svg" class="rectangle-top-right">
          <img src="@/assets/images/Rectangle.svg" class="rectangle-bottom-left">
          <img src="@/assets/images/Rectangle.svg" class="rectangle-bottom-right">
          <!-- Thêm nút button -->
          <div class="button">

            <button class="center-button">
              <img src="@/assets/images/icon_plus_dark.svg" class="icon-plus">
              <span class="button-text">新しく作る</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Thêm button trong class generate -->
      <div class="generate">
        <button class="generate-button generate-button-text">完了</button>
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

    return {
      questionId,
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
  background: #C8C8C8;
  color: white;
}


.generate-button-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
}


</style>
