<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
      <div class="logout-button" @click="logout">ログアウト</div>
    </div>
    <div class="scrollable-content">
      <div class="parent-component">
        <HeaderAddQuestion :id="1" />
      </div>
      <div class="body-addquestion">
        <BodyAddQuestion :questionId="questionId" />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAddQuestion from "@/components/HeaderAddQuestion.vue";
import BodyAddQuestion from "~/components/BodyAddQuestion.vue";

export default {
  components: {
    HeaderAddQuestion,
    BodyAddQuestion,
  },
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      questionId: localStorage.getItem("adminQuestionIDCurrent"),
    };
  },
  methods: {
    logout() {
      // Navigate to /Admin/Login
      this.$router.push('/Admin/Login');
    },
  },

};
</script>

<style scoped>
/* Banner */
.login-banner {
  display: flex;
  background-color: #e13a4b; /* Màu đỏ */
  margin-top: 0px;
  width: 100%; /* Chiều rộng bằng 100% của trang */
  height: 56px; /* Chiều cao 56px */
  position: fixed; /* Cố định vị trí của header */
  top: 0;
  left: 0;
  z-index: 1000; /* Đảm bảo header luôn nằm trên các phần tử khác */
}

/* Trang đăng nhập */
.login-page {
  background-color: #f9efe3; /* Màu nền */
  background-image: url("@/assets/images/background.svg"); /* Hình nền */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  flex-direction: column; /* Sắp xếp theo chiều dọc */
  justify-content: center;
  align-items: center;
  height: 100vh; /* Chiều cao của toàn bộ trang */
  margin: 0;
  max-height: calc(100dvh); /* Set maximum height to 100 viewport height */
  overflow: hidden; /* Disable scroll on the body */

  /* Hide scrollbar for WebKit browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollable-content {
  margin-top: 56px; /* Khoảng cách bằng chiều cao của header để không bị che khuất */
  width: 100%;
  height: calc(100vh - 56px); /* Chiều cao trừ đi chiều cao của header */
  overflow-y: auto; /* Enable vertical scrolling */

  /* Hide scrollbar for WebKit browsers */
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for WebKit-based browsers */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Optional: just in case it's visible in some browser */
  }
}

.banner-content {
  display: flex;
  justify-content: space-between; /* Căn hai phần tử con ra hai bên */
  align-items: center;
  padding: 0 16px; /* Khoảng cách giữa các phần tử */
}

.banner-text {
  font-family: "Noto Sans JP", sans-serif;
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
  margin-left: 100px;
}

.parent-component {
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  flex-direction: column; /* Sắp xếp theo chiều dọc */
  padding-top: 24px;
  padding-bottom: 24px;
}

.logout-button {
  display: flex; /* Sử dụng display: flex để có thể căn giữa */
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  cursor: pointer;
  color: white; /* Màu chữ trắng */
  height: 100%; /* Chiều cao của nút */
  width: 120px;
}

.body-addquestion {
  margin-bottom: 24px;
}
</style>
