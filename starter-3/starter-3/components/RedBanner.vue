<template>
    <div class="banner-container">
      <slot></slot>
    </div>
  </template>
  
  <script>

  export default {
    name: "RedBanner",
    components: {
    },
  };
  </script>
  
  <style scoped>
  .banner-container {
    background-color: #E13A4B; /* Màu nền */
    width: 100%;
    height: 56px; /* Điều chỉnh chiều cao theo nhu cầu */
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px; /* Khoảng cách để căn chỉnh nội dung */
  }
  </style>
  