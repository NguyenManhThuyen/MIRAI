<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="ユーザー名または電子メール" />
      </div>
      <div class="input-group relative">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="パスワード" />
        <img @click="togglePasswordVisibility" :src="eyeIcon" alt="Toggle Password Visibility" class="eye-icon"/>
      </div>
      <div class="forgot-password">
        <NuxtLink to="/Admin/ForgotPassword">パスワードを忘れましたか?</NuxtLink>
      </div>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
      <button type="submit">ログイン</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import eyeIcon from '@/assets/images/remove-red-eye.svg'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loginError = ref('')
const router = useRouter()

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    loginError.value = 'ユーザー名とパスワードを入力してください。'
    return
  }

  try {
    const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/login', {
      email: username.value,
      password: password.value,
    }, {
      headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
    })

    if (response.status === 200) {
      localStorage.setItem('username', username.value)
      router.push('/Admin/MainPage')
      username.value = ''
      password.value = ''
    } else {
      loginError.value = 'サーバーに接続できません。後でもう一度やり直してください。'
    }
  } catch (error) {
    loginError.value = 'パスワードが間違っているか、このアカウントは存在しません。パスワードをリセットするか、この記事を確認してください。'
    console.error('Login error:', error)
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.login-container {
  background-color: #ffffff;
  padding: 40px 24px 40px 24px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  color: #2E7CF6;
  margin-top: 0px;
  margin-bottom: 24px;
  max-height: 56px;
  font-size: 40px;
  font-weight: bold;
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
  outline: none;
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
  text-align: right;
  height: 20px;
  margin-bottom: 24px;
}

.forgot-password a {
  color: #1A1A1A;
  text-decoration: none;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 19.6px;
  text-align: center;
}

button {
  width: 100%;
  max-width: 437px;
  height: 56px;
  background-color: #2E7CF6;
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
  transition: transform 0.4s ease;
}

button:hover {
  transform: scale(1.02);
}

.error-message {
  width: 100%;
  height: auto;
  background: #2E7CF633;
  color: #2E7CF6;
  border: none;
  padding: 12px 16px;
  border-radius: 112px;
  gap: 10px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
  margin-bottom: 8px;
}
</style>
