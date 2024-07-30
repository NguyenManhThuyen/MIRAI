<template>
    <div>
      <div class="login-page">
        <div class="branding">
          <img src="@/assets/images/mirai-icon.svg" class="brand-icon"/>
          <p class="brand-text">スカイウォーキング・デジタルクイズチャレンジ Admin</p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  </template>
  
  <script setup>
  useHead({
        title: 'Change Password | MIRAI',
    });
  </script>
  
  <style scoped>
  /* Trang đăng nhập */
  .login-page {
    background-color: #F1F4F9; /* Màu nền */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Căn giữa theo chiều dọc */
    align-items: center; /* Căn giữa theo chiều ngang */
    height: 100dvh; /* Sửa thành 100vh để đảm bảo trang chiếm toàn bộ viewport height */
    margin: 0;
    padding: 0; /* Xóa padding mặc định */
    overflow: hidden; /* Ẩn phần dư thừa */
  }
  
  .branding {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px; /* Khoảng cách dưới */
  }
  
  .brand-icon {
    width: 55px; /* Đặt kích thước icon */
    height: 53px;
    margin-bottom: 20px; /* Khoảng cách giữa icon và text */
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
  