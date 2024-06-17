<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <h3>アカウントの電子メールを入力してください。パスワードをリセットするための電子メールが送信されます。</h3>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="メールアドレスを入力して" />
        <div v-if="showErrors" class="error-message">{{ errorMessage }}</div>
      </div>
      <button type="submit">確認する</button>
    </form>
    <nuxt-link v-if="success" :to="{ path: '/Admin/ForgotPasswordCode' }"></nuxt-link>
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
      errorMessage: '', // Error message
    };
  },
  methods: {
    async handleSubmit() {
      this.showErrors = true; // Hiển thị thông báo lỗi
      if (!this.username) {
        // Hiển thị thông báo lỗi nếu username trống
        this.errorMessage = 'メールアドレスを入力してください';
      } else if (this.username === 'thuyen') {
        // Hiển thị thông báo lỗi nếu username là "thuyen"
        this.errorMessage = 'メールアドレスが正しくありません';
      } else {
        // Nếu không có lỗi, tiếp tục xử lý
        try {
          const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/sendCode', {
            email: this.username
          });
          localStorage.setItem("email", this.username);
          this.success = true;
          this.$emit('success');
        } catch (error) {
          this.errorMessage = 'リクエストの送信に失敗しました。もう一度試してください。';
        }
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
