<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
    </div>
    
    <div class="parent-component">
      <HeaderAddQuestion :id="1"/>
    </div>
  <div class="body-addquestion">
    <BodyAddQuestion :id="questionId" />
  </div>
  </div>
</template>

<script>
import HeaderAddQuestion from '@/components/HeaderAddQuestion.vue';
import BodyAddQuestion from '~/components/BodyAddQuestion.vue';

export default {
  components: {
    HeaderAddQuestion,
  },
  props: {
    id: {
      type: Number,
    }
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
  
  
  /* Responsive CSS */
  @media screen and (max-width: 768px) {
    .parent-component {
      padding: 0 20px; /* Thêm padding để trang đăng nhập không bị dính vào mép */
    }
  }
  
  @media screen and (max-width: 480px) {
    .login-banner {
      height: 40px; /* Giảm chiều cao của banner cho các thiết bị nhỏ hơn */
    }
  }
</style>
