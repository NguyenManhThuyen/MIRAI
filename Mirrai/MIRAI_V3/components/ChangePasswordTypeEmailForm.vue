<template>
    <div class="change-password-container">
      <h2>パスワードを変更する</h2>
      <p class="description">
        アカウントの電子メールを入力してください。パスワードをリセットするための電子メールが送信されます。
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="email" v-model="email" placeholder="メールアドレス" />
        </div>
        <button type="submit">メールを送る</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const email = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  
  const handleSubmit = async () => {
    if (!email.value) {
      errorMessage.value = '電子メールを入力してください。'
      return
    }
  
    try {
      const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/reset-password', {
        email: email.value,
      }, {
        headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
      })
  
      if (response.status === 200) {
        successMessage.value = 'リセットのための電子メールが送信されました。'
        errorMessage.value = ''
        email.value = ''
      } else {
        errorMessage.value = 'サーバーに接続できません。後でもう一度やり直してください。'
        successMessage.value = ''
      }
    } catch (error) {
      errorMessage.value = '電子メールが無効であるか、このアカウントは存在しません。'
      successMessage.value = ''
      console.error('Error:', error)
    }
  }
  </script>
  
  <style scoped>
  .change-password-container {
    background-color: #ffffff;
    padding: 32px 20px 32px 20px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 100px;
    text-align: center;
    gap: 10px;
    border: 1px;
  }
  
  h2 {
    color: #2E7CF6;
    font-family: Verdana;
    font-size: 32px;
    font-weight: 700;
    line-height: 44.8px;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .description {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    text-align: center;
    color: #1A1A1A;
    margin-bottom: 24px;
  }
  
  .input-group {
    box-sizing: border-box;
    width: 100%;
    height: 56px;
    margin-bottom: 8px;
    position: relative;
  }
  
  .input-group input {
    border: 1px solid #ccc;
    border-radius: 12px;
    width: 100%;
    height: 56px;
    padding-left: 27px;
    color: #BBBBBB;
    outline: none;
    border: 1px solid #D9D9D9;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    text-align: left;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    height: 56px;
    background-color: #2E7CF6;
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
    transition: transform 0.4s ease;
  }
  
  button:hover {
    transform: scale(1.02);
  }
  
  .error-message, .success-message {
    width: 100%;
    height: auto;
    border: none;
    padding: 12px 16px;
    border-radius: 12px;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20.27px;
    letter-spacing: 0.02em;
    text-align: center;
    margin-top: 8px;
  }
  
  .error-message {
    color: #FF0909;
  }
  
  .success-message {
    color: #28a745;
  }
  </style>
  