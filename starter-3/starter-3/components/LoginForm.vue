<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="ユーザー名または電子メール" required />
      </div>
      <div class="input-group relative">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="パスワード。" required />
        <img @click="togglePasswordVisibility" src="@/assets/images/remove-red-eye.svg" alt="Toggle Password Visibility" class="eye-icon"/>
      </div>
      <div class="forgot-password">
        <!-- Điều kiện kiểm tra loginError để xác định xem có nên chuyển hướng hay không -->
        <nuxt-link v-if="!loginError && username && password" to="/Admin/MainPage">パスワードを忘れましたか?</nuxt-link>
        <nuxt-link v-else to="/Admin/ForgotPassword">パスワードを忘れましたか?</nuxt-link>
      </div>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
      <button type="submit">ログイン</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loginError: '',  // Thêm thuộc tính loginError để lưu trữ thông báo lỗi
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.username || !this.password) {
        this.loginError = 'ユーザー名とパスワードを入力してください。';
        return;
      }

      try {
        const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/login', {
          email: this.username,
          password: this.password,
        }, {
          headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*', }
        });

        if (response.status === 200) {
          this.$router.push('/Admin/MainPage');
        } else {
          this.loginError = 'サーバーに接続できません。後でもう一度やり直してください。';
        }
      } catch (error) {
        this.loginError = 'パスワードが間違っているか、このアカウントは存在しません。パスワードをリセットするか、この記事を確認してください。';
        console.error('Login error:', error);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>


<style scoped>
.login-container {
  background-color: #ffffff;
  padding: 40px 24px 40px 24px;
  border-radius: 10px;
  width: 100%;
  max-width: 487px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  color: #E13A4B;
  margin-top: 0px;
  margin-bottom: 24px;
  max-height: 56px;
  font-size: 40px;
  font-weight: bold;
}



.input-group {
  box-sizing: border-box; /* Tính cả padding và border vào kích thước */
  width: 100%; /* Kích thước cố định */
  height: 56px;
  margin-bottom: 8px;
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
  color: #BBBBBB;
  outline: none; /* Thêm dòng này để loại bỏ đường viền khi focus */
}

.eye-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px;
  height: 24px;
  padding-right: 6.5px;
}

.forgot-password {
  text-align: right; /* Canh lề trái */
  height: 20px;
  margin-bottom: 24px;
}

.forgot-password a {
  color: #1A1A1A;
  text-decoration: none;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 700; /* Thêm thuộc tính in đậm */
  line-height: 19.6px;
  text-align: center;
}

button {
  width: 100%;
  max-width: 437px;
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
  transition: transform 0.4s ease; /* Hiệu ứng chuyển động cho transform */
}

button:hover {
  transform: scale(1.02); /* Phóng to 105% khi di chuột qua */
}


.error-message {
  width: 100%;
  height: auto; /* Adjust height dynamically */
  background: #E13A4B33;
  color: #E13A4B;
  border: none;
  padding: 12px 16px;
  border-radius: 112px;
  gap: 10px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  text-align: center;
  word-wrap: break-word; /* Allow wrapping */
  white-space: normal; /* Enable wrapping */
  margin-bottom: 8px;
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
