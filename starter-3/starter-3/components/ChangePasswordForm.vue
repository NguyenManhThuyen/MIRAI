<template>
  <div class="login-container">
    <h2>パスワードを変更する</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="password" v-model="password" placeholder="新しいパスワード" />
        <div v-if="showErrors && !password" class="error-message">まだ新しいパスワードが入力していません</div>
      </div>
      <div class="input-group">
        <input type="password" v-model="confirmPassword" placeholder="新しいパスワードを確認" />
        <div v-if="showErrors && !confirmPassword" class="error-message">まだ新しいパスワードの確認が入力していません</div>
        <div v-if="showErrors && password && confirmPassword && password !== confirmPassword" class="error-message">パスワードが一致しません</div>
      </div>
      <button type="submit">パスワードを変更する</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      showErrors: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.showErrors = true; // Hiển thị thông báo lỗi

      // Kiểm tra xem đã nhập đủ thông tin chưa
      if (!this.password || !this.confirmPassword) {
        return;
      }

      // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
      if (this.password !== this.confirmPassword) {
        return;
      }

      // Nếu mọi thông tin đều hợp lệ, gửi yêu cầu API để thay đổi mật khẩu
      try {
        const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/changePassword', {
          email: localStorage.getItem('email'),
          newpassword: this.password,
          code: localStorage.getItem('code'),
        });

        console.log('Response:', response.data);
        this.success = true;
        this.$emit('success');
        this.showErrors = false;
        this.$router.push('/Admin/Login'); // Chuyển hướng tới trang login
      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'リクエストの送信に失敗しました。もう一度試してください。'; // Thông báo lỗi khi gọi API thất bại
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
