<template>
    <div class="view-container">
        <HappyGiftBox/>
      <div class="footer-wrapper">
        <FooterQuestion :footerImage="footerImage" class="footer-question" />
      </div>
    </div>
  </template>
  
  <script>
  import HappyGiftBox from '@/components/HappyGiftBox.vue';
  import FooterQuestion from '@/components/FooterQuestion.vue';
  import footerImage from '@/assets/images/footerQuestion.png';
  
  export default {
    name: "HappyGiftBoxView",
    components: {
      HappyGiftBox,
      FooterQuestion,
    },
    data() {
      return {
        footerImage,
      };
    },
  };
  </script>
  
  <style scoped>
  .view-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 62px;
    background-color: #F9EFE3; /* Màu nền */
    background-image: url('@/assets/images/background.svg'); /* Hình nền */
    height: 100vh; /* Chiều cao của phần còn lại của trang */
  }
  
  .footer-wrapper {
    margin-top: auto; /* Footer sẽ luôn nằm ở dưới cùng */
  }
  
  </style>
  