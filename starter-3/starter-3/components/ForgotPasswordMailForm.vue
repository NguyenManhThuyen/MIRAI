<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <h3>アカウントの電子メールを入力してください。パスワードをリセットするための電子メールが送信されます。</h3>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="メールアドレスを入力して" />
        <div v-if="showErrors && !username" class="error-message">{{ errorMessage }}</div>
      </div>
      <nuxt-link v-if="username" to="/Admin/ForgotPasswordCode">
        <button type="submit">確認する</button>
      </nuxt-link>
      <div v-else>
        <button type="submit" disabled>確認する</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      showErrors: false,
      errorMessage: 'あなたのメールアドレスが間違っています', // Error message
    };
  },
  methods: {
    handleSubmit() {
      this.showErrors = true; // Set showErrors to true to display error messages
      if (!this.username) {
        // Username is empty, error message will be displayed
      } else {
        // Username is valid, proceed with submission
        console.log('Username:', this.username);
        this.$emit('success');
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
