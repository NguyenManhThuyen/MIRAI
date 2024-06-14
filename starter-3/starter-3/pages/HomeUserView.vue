<template>
  <div class="view-container">
    <HomeUser />
  </div>
</template>

<script>
import HomeUser from '@/components/HomeUser.vue';

export default {
  components: {
    HomeUser
  },
  name: 'HomeUserView',
};
</script>

<style scoped>
.view-container {
  background-color: #F9EFE3; /* Màu nền */
  background-image: url('@/assets/images/background.svg'); /* Hình nền */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: center; /* Canh giữa theo chiều ngang */
  align-items: flex-start; /* Đẩy nội dung lên trên cùng */
  height: 100dvh; /* Chiều cao của phần còn lại của trang */
  margin: 0;
  padding-top: 60px; /* Khoảng cách từ trên cùng */

  
}
</style>
