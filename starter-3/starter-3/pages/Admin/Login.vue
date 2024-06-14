<template>
  <div>
    <div class="login-banner"></div>
    <div class="login-page">
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
      this.$router.push({ name: '/Admin/MainPage' });
    }
  }
};
</script>

<style scoped>
/* Banner */
.login-banner {
  background-color: #E13A4B; /* Màu đỏ */
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100dvh - 56px); /* Chiều cao của phần còn lại của trang */
  margin: 0;

  max-height: calc(100dvh); /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */

    /* Hide scrollbar for WebKit browsers */
    scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

/* Responsive CSS */
@media screen and (max-width: 768px) {
  .login-page {
    padding: 0 20px; /* Thêm padding để trang đăng nhập không bị dính vào mép */
  }
}

@media screen and (max-width: 480px) {
  .login-banner {
    height: 40px; /* Giảm chiều cao của banner cho các thiết bị nhỏ hơn */
  }
}
</style>
