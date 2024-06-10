<template>
    <div>
      <div class="login-banner"></div>
      <div class="login-page">
        <ChangePasswordForm @success="handleLoginSuccess" />
      </div>
    </div>
  </template>
  
  <script>
  import ChangePasswordForm from '@/components/ForgotPasswordForm.vue';
  
  export default {
    name: "LoginPage",
    components: {
        ChangePasswordForm,
    },
    methods: {
      handleLoginSuccess() {
        this.$router.push('/Admin/ForgotPasswordCode');
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
  