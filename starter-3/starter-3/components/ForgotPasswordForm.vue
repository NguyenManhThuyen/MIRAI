<template>
    <div class="login-container">
      <h2>ログイン</h2>
      <h3>アカウントの電子メールを入力してください。パスワードをリセットするための電子メールが送信されます。</h3>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="text" v-model="username" placeholder="メールアドレスを入力して" required />
        </div>
        <button type="submit">メールを送る</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
      };
    },
    methods: {
      handleSubmit() {
        console.log('Tên người dùng:', this.username);

        this.$emit('success');
      }
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    background-color: #ffffff;
    padding: 20px;
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
  