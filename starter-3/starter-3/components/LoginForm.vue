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
        <a href="#">パスワードを忘れましたか?</a>
      </div>
      <button type="submit">ログイン</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    handleSubmit() {
      // Giả sử đăng nhập thành công
      console.log('Tên người dùng:', this.username);
      console.log('Mật khẩu:', this.password);
      
      // Phát sự kiện đăng nhập thành công
      this.$emit('login-success');
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
  max-width: 437px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  color: #E13A4B;
  margin-top: 0px;
  margin-bottom: 24px;
  max-height: 56px;
  font-size: 40px;
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
  max-width: 416px;
  height: 52px;
  padding-left: 17px;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  line-height: 22.4px;
  text-align: left;
  color: #BBBBBB;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 20px;
  height: 20px;
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
  height: 56px;
  background-color: #E13A4B;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 112px;
  gap: 10px;
  font-family: 'Noto Sans JP', sans-serif; /* Thêm font-family */
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s; /* Chỉ áp dụng hiệu ứng biến đổi khi rê chuột qua */
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
