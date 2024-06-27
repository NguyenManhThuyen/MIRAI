<template>
  <div>
    <div class="login-page">
      <div class="branding">
        <img src="@/assets/images/mirai_icon.svg" class="brand-icon"/>
        <p class="brand-text">スカイウォーキング・デジタルクイズチャレンジ Admin</p>
      </div>
      <LoginForm @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: "LoginPage",
  components: {
    LoginForm,
  },
  methods: {
    handleLoginSuccess() {
      this.$router.push('/Admin/MainPage');
    }
  }
};
</script>

<style scoped>
/* Trang đăng nhập */
.login-page {
  background-color: #F1F4F9; /* Màu nền */
  /*background-image: url('@/assets/images/background.svg'); Hình nền */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh; /* Chiều cao của phần còn lại của trang */
  margin: 0;
  width: auto;
  max-height: 100dvh; /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */

  /* Hide scrollbar for WebKit browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

.branding {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; /* Khoảng cách dưới */
}

.brand-icon {
  width: 55px; /* Đặt kích thước icon */
  height: 53px;
  margin-bottom: 10px; /* Khoảng cách giữa icon và text */
}

.brand-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #000000; /* Màu chữ đen */
}
</style>
