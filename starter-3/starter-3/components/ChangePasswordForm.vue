<template>
  <div class="login-container">
    <h2>パスワードを変更する</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="password" v-model="password" placeholder="新しいパスワード" required />
      </div>
      <div class="input-group">
        <input type="password" v-model="confirmPassword" placeholder="新しいパスワードを確認" required />
        <div v-if="showErrors && passwordMismatch" class="error-message">{{ errorMessage }}</div>
      </div>
      <button type="submit">パスワードを変更する</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      showErrors: false,
      passwordMismatch: false,
      errorMessage: 'パスワードが一致しません', // Thông báo lỗi bằng tiếng Nhật
    };
  },
  methods: {
    handleSubmit() {
      this.showErrors = true; // Hiển thị thông báo lỗi
      this.passwordMismatch = this.password !== this.confirmPassword;

      if (!this.passwordMismatch) {
        console.log('新しいパスワード:', this.password);
        console.log('新しいパスワードを確認:', this.confirmPassword);
        this.$emit('success');
        this.showErrors = false;
        this.$router.push('/Admin/Login'); // Chuyển hướng tới trang login
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
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 40px;
  font-family: Verdana;
  font-weight: 700;
  line-height: 56px;
  text-align: center;
}

.input-group {
  box-sizing: border-box; /* Tính cả padding và border vào kích thước */
  width: 100%;
  margin-bottom: 24px; /* Thêm khoảng cách dưới */
}

.input-group input {
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  width: 100%;
  height: 52px;
  padding-left: 17px;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  line-height: 22.4px;
  text-align: left;
  color: #333; /* Thay đổi màu chữ để dễ đọc hơn */
}

button {
  width: 100%;
  height: 56px;
  background-color: #E13A4B;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 112px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 26px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
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
