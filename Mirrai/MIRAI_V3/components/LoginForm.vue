<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input type="text" v-model="username" @input="clearErrorMessage" placeholder="ユーザー名または電子メール" />
      </div>
      <div class="input-group relative">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" @input="clearErrorMessage" placeholder="パスワード" />
        <img @click="togglePasswordVisibility" :src="eyeIcon" class="eye-icon" />
      </div>
      <div class="forgot-password">
        <NuxtLink to="/admin/ChangePasswordTypeEmail">パスワードを忘れましたか?</NuxtLink>
      </div>
      <button type="submit">ログイン</button>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import eyeIcon from '@/assets/images/admin-remove-red-eye.svg'
import NProgress from 'nprogress'
import { onUnmounted } from 'vue'

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

  NProgress.start()
  NProgress.set(0.4)

  try {
    const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/login', {
      email: username.value,
      password: password.value,
    }, {
      headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
    })

    if (response.status === 200) {
      sessionStorage.setItem('email', response.data)
      await router.push('/admin/Home')
      username.value = ''
      password.value = ''
    } else if (response.status === 202) {
      sessionStorage.setItem('email', response.data)
      await router.push('/admin/ChangePassword')
      username.value = ''
      password.value = ''
    } else {
      loginError.value = 'サーバーに接続できません。後でもう一度やり直してください。'
      password.value = ''
    }
  } catch (error) {
    loginError.value = 'コードが正しくありません'
    password.value = ''
    console.error('Login error:', error)
  } finally {
    NProgress.done()
  }
}


const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}


onUnmounted(() => {
  // Đóng lỗi khi click ra ngoài form hoặc các thao tác khác trên trang
  document.addEventListener('click', clearErrorMessage)
  // Loại bỏ event listener khi component bị unmounted để tránh memory leak
  document.removeEventListener('click', clearErrorMessage)
})

// Hàm xử lý đóng lỗi
const clearErrorMessage = () => {
  loginError.value = '' // Đặt lại giá trị lỗi thành rỗng
}
</script>

<style scoped>
.login-container {
  background-color: #ffffff;
  padding: 32px 20px;
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
  font-family: Verdana;
  font-size: 32px;
  font-weight: 700;
  line-height: 44.8px;
  text-align: center;
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
  padding-right: 27px;
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
  font-family: Noto Sans JP;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: center;
}

button {
  width: 100%;
  max-width: 360px;
  height: 56px;
  background-color: #2E7CF6;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 112px;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.4s ease;
  border-radius: 12px;
  font-family: Noto Sans JP;
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
  padding: 12px 16px 0 16px;
  border-radius: 12px;
  font-family: 'Noto Sans JP';
  font-size: 14px;
  font-weight: 500;
  line-height: 20.27px;
  letter-spacing: 0.02em;
  text-align: center;
  margin-top: 8px;
}

@media screen and (max-width: 768px) {
  .login-container {
    margin-bottom: 70px;
  }
}

@media screen and (max-width: 576px) {
  .login-container {
    margin-bottom: 85px;
  }
}

@media screen and (max-width: 425px) {
  .login-container {
    margin-bottom: 100px;
  }
}

</style>
