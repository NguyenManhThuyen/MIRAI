<template>
  <div>
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
      <div class="logout-button" @click="logout">ログアウト</div>
    </div>

    <div class="login-page">
      <div class="header-container">
        <div class="wrapper">
          <h2 class="nagoya-heading">名古屋縦走</h2>
        </div>
      </div>
      <div class="content-container">
        <QuestionList />
      </div>
    </div>
  </div>
</template>

<script>
import QuestionList from "@/components/QuestionList.vue";

export default {
  components: {
    QuestionList,
  },
  methods: {
    logout() {
      // Perform logout actions here (if any)

      // Navigate to /Admin/Login
      this.$router.push('/Admin/Login');
    }
  },
};
</script>

<style scoped>
/* Banner */
.login-banner {
  display: flex;
  background-color: #e13a4b; /* Red color */
  width: 100%; /* Full width */
  height: 56px; /* Height of 56px */
}

/* Login Page */
.login-page {
  background-color: #f9efe3; /* Background color */
  background-image: url("@/assets/images/background.svg"); /* Background image */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column; /* Arrange children vertically */
  align-items: center;
  height: calc(100dvh - 56px); /* Full height minus banner */
  margin: 0;

  max-height: calc(100dvh); /* Set maximum height to 100 viewport height */
  overflow-y: auto; /* Enable vertical scrollbar */

    /* Hide scrollbar for WebKit browsers */
    scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

/* Header Container */
.header-container {
  margin-top: 24px;
  margin-bottom: 16px;
  width: 819px; /* Width */
  height: 92px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff; /* Background color */
  box-shadow: 0px 6px 12px 0px #0000001f; /* Box shadow */
  border-radius: 16px; /* Top rounded corners */
}
.logout-button {
  width: 100px;
  display: flex; /* Sửa 'flexbox' thành 'flex' */
  color: white; /* Màu chữ trắng */
  white-space: nowrap; /* Ngăn không cho văn bản ngắt dòng */
  align-items: center; /* Căn giữa nội dung theo trục dọc nếu có các phần tử con */
  justify-content: center; /* Căn giữa nội dung theo trục ngang nếu có các phần tử con */
  padding: 10px 20px; /* Thêm padding cho button */
  background-color: #E13A4B; /* Màu nền (có thể thay đổi theo nhu cầu) */
  border: none; /* Loại bỏ đường viền */
  border-radius: 25px; /* Tạo góc bo tròn cho button */
  cursor: pointer; /* Hiển thị con trỏ khi hover */
  font-family: 'Noto Sans JP', sans-serif; /* Font chữ (thay đổi theo nhu cầu) */
  font-size: 16px; /* Kích thước chữ (thay đổi theo nhu cầu) */
  transition: background-color 0.3s; /* Thêm hiệu ứng chuyển đổi màu nền khi hover */
}

.logout-button:hover {
  background-color: #c12a3b; /* Màu nền khi hover (có thể thay đổi theo nhu cầu) */
}
.wrapper {
  background-color: #ffffff; /* Màu nền là trắng */
  height: 92px; /* Độ cao là 92px */
  display: flex;
  justify-content: left;
  align-items: left;
  width: 100%;
  margin-bottom: 16px; /* Khoảng cách phía dưới là 16px */
  padding: 24px;
  gap: 10px;
  border-radius: 16px;
  display: flex;
}

/* Nagoya Heading */
.nagoya-heading {
  font-family: "Noto Sans JP", sans-serif; /* Font family */
  font-size: 24px; /* Font size */
  font-weight: 700; /* Font weight */
  line-height: 34.75px; /* Line height */
  text-align: left; /* Text alignment */
  width: 771px;
  height: 44px;
  gap: 16px;
  position: relative; /* Set position to relative */
}

/* Add line below Nagoya Heading */
.nagoya-heading::after {
  content: ""; /* Empty content */
  position: absolute; /* Set position to absolute */
  bottom: 0; /* Align at the bottom */
  left: 0; /* Align at the left */
  width: 100%; /* Full width */
  height: 1px; /* Height of the line */
  background-color: #cccccc; /* Color of the line */
}

/* Content Container */
.content-container {
  width: 817px; /* Width */
  height: auto; /* Height */
  padding: 24px 24px 12px 24px; /* Padding */
  gap: 10px; /* Gap */
  border-radius: 16px; /* Bottom rounded corners */
  opacity: 1; /* Opacity */
  background: #ffffff; /* Background color */
  box-shadow: 0px 6px 12px 0px #0000001f; /* Box shadow */
  display: flex;
  flex-direction: column; /* Arrange children vertically */
  justify-content: left;
  margin-bottom: 48px;
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

/* For small devices such as phones */
@media (max-width: 576px) {
  /* .login-page {
    height: auto;
  } */

  .header-container {
    width: 100%;
  }

  .nagoya-heading {
    width: 100%;
    text-align: center;
  }

  .content-container {
    width: 80%;
    padding: 12px;
  }
}
/* For small devices such as phones */
@media (max-width: 576px) {
  /* .login-page {
    height: auto;
  } */

  .header-container {
    width: 100%;
  }

  .nagoya-heading {
    width: 100%;
    text-align: center;
  }

  .content-container {
    width: 85%;
    padding: 12px;
  }
}

/* For medium devices such as tablets */
@media (min-width: 577px) and (max-width: 768px) {
  /* .login-page {
    height: auto;
  } */

  .header-container {
    width: 90%;
  }

  .nagoya-heading {
    width: 100%;
    text-align: center;
  }

  .content-container {
    width: 90%;
    padding: 16px;
  }
}

/* For large devices such as laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  /* .login-page {
    height: calc(100vh - 56px);
  } */

  .header-container {
    width: 90%;
  }

  .nagoya-heading {
    width: 100%;
    text-align: left;
  }

  .content-container {
    width: 95%;
    padding: 24px;
  }
}

/* For extra small devices such as small phones */
@media (max-width: 425px) {
  /* .login-page {
    height: auto;
  } */

  .header-container {
    width: 100%;
  }

  .nagoya-heading {
    width: 100%;
    text-align: center;
  }

  .content-container {
    width: 100%;
    padding: 8px;
  }
}
</style>
