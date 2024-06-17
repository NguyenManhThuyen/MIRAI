<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <h3>メールアドレスを入力すると、パスワードが要求されます。コードをスキャンしてコンピューターに入力する</h3>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="コードを入力する" />
        <!-- Hiển thị lỗi khi chưa nhập mã -->
        <div v-if="showErrors && !username" class="error-message">{{ errorMessageEmpty }}</div>
        <!-- Hiển thị lỗi khi mã không chính xác -->
        <div v-if="showErrors" class="error-message">{{ errorMessageIncorrect }}</div>
      </div>
      <button type="submit">確認する</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: '',
      showErrors: false,
      success: false,
      errorCode: null, // Trạng thái lưu mã lỗi từ API
      errorMessageEmpty: 'まだコードが入力されていません', // Thông báo lỗi khi chưa nhập mã
      errorMessageIncorrect: 'コードが正しくありません', // Thông báo lỗi khi mã không chính xác
    };
  },
  methods: {
    async handleSubmit() {
  this.showErrors = true; // Hiển thị thông báo lỗi
  this.errorCode = null; // Đặt lại mã lỗi

  if (!this.username) {
    // Nếu username trống, hiển thị thông báo lỗi chưa nhập mã
    return;
  } else if (this.username === 'thuyen') {
    // Nếu username là 'thuyen', hiển thị thông báo lỗi mã không chính xác
    return;
  } else {
    // Nếu không có lỗi, tiếp tục xử lý
    axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/verifyCode', {
      email: localStorage.getItem('email'),
      code: this.username
    })
    .then((response) => {
      if (response.data.status === 404 || response.data.status === 403) {
        // Nếu API trả về lỗi 404 hoặc 403, hiển thị thông báo lỗi
        this.errorCode = response.data.status;
        this.errorMessage = 'コードが正しくありません';
      } else {
        localStorage.setItem("code", this.username);
        console.log('Response:', response.data);
        this.success = true; // Đặt trạng thái thành công
        this.$router.push('/Admin/ChangePassword'); // Chuyển hướng tới trang đổi mật khẩu
        this.$emit('success');
      }
    })
    .catch((error) => {
      // Kiểm tra mã lỗi và đặt thông báo lỗi tương ứng
      if (error.response && error.response.status === 403) {
        this.errorMessage = 'コードが正しくありません';
      } else {
        this.errorMessage = 'リクエストの送信に失敗しました。もう一度試してください。';
      }
    })
    .finally(() => {
      // Sau khi hoàn thành, enable lại nút generate
      generateButtonDisabled.value = false;
    });
  }
},

  },
};
</script>

<style scoped>
.login-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 485px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  color: #E13A4B;
  margin-top: 0px;
  margin-bottom: 24px;
  font-size: 40px;
  font-weight: bold;
}

h3 {
  margin-bottom: 24px;
}

.input-group {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  margin-bottom: 24px;
  position: relative;
}

.input-group input {
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  width: 100%;
  max-width: 437px;
  height: 52px;
  padding-left: 17px;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  line-height: 22.4px;
  text-align: left;
  color: #333;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
}

button {
  width: 100%;
  height: 56px;
  background-color: #E13A4B;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 112px;
  gap: 10px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

button:hover {
  transform: scale(1.05);
}

@media screen and (max-width: 480px) {
  .login-container {
    padding: 20px;
  }

  .input-group input {
    width: calc(100% - 34px);
  }

  button {
    padding: 14px;
  }
}
</style>
