<template>
  <div class="change-password-container">
    <h2>パスワードを変更する</h2>
    <p class="description">メールアドレスに送付されたメールに記載されているコードを入力してください。</p>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="code" placeholder="コードを入力する" />
      </div>
      <button type="submit">確認する</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const code = ref('')
const errorMessage = ref('')

// Watch for changes in the `code` input to hide the error message
watch(code, () => {
  errorMessage.value = ''
})


const handleSubmit = async () => {
  if (!code.value) {
    errorMessage.value = 'コードを入力してください。'
    return
  }

  try {
    const response = await axios.post('https://example.com/api/verify-code', {
      code: code.value,
    }, {
      headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
    })

    if (response.status === 200) {
      // Handle success
      errorMessage.value = ''
      alert('コードが確認されました。')
    } else {
      errorMessage.value = 'サーバーに接続できません。後でもう一度やり直してください。'
    }
  } catch (error) {
    errorMessage.value = 'コードが正しくありません。'
    console.error('Verification error:', error)
  }
}
</script>

<style scoped>
.change-password-container {
  background-color: #ffffff;
  padding: 32px 20px 32px 20px;
  border-radius: 16px;
  width: 90%; /* Đặt kích thước phần tử chính theo phần trăm */
  max-width: 400px; /* Đặt kích thước tối đa */
  margin: 0 auto; /* Căn giữa */
  text-align: center;
  gap: 10px;
  border: 1px;
  margin-bottom: 110px;
}

h2 {
  color: #2E7CF6;
  font-family: 'Noto Sans JP', sans-serif;
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
  max-width: 437px;
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
  max-width: 360px;
  height: 56px;
  background-color: #2E7CF6;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.4s ease;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 22.4px;
  text-align: center;
}

button:hover {
  transform: scale(1.02);
}

.error-message {
  width: 100%;
  height: auto;
  color: #FF0909;
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
@media screen and (max-width: 768px) {
  .change-password-container {
    margin-bottom: 70px;
  }
}

@media screen and (max-width: 576px) {
  .change-password-container {
    margin-bottom: 85px;
  }
}

@media screen and (max-width: 425px) {
  .change-password-container {
    margin-bottom: 100px;
  }
}
</style>
