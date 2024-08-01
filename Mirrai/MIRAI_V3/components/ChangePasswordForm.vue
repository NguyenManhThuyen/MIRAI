<template>
  <div class="change-password-container">
    <h2>パスワードを変更する</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input
          type="password"
          v-model="currentPassword"
          placeholder="現在のパスワード"
          @input="clearError"
        />
      </div>
      <div class="input-group">
        <input
          type="password"
          v-model="newPassword"
          placeholder="新しいパスワード"
          @input="clearError"
        />
      </div>
      <div class="input-group">
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="パスワードの確認"
          @input="clearError"
        />
      </div>
      <button type="submit">パスワードを変更する</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import NProgress from 'nprogress'
  import { useRoute,useRouter } from 'vue-router';

  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const errorMessage = ref('')
  const route = useRoute();
  const router = useRouter()
  const code = ref('');

  const handleSubmit = async () => {
    NProgress.start()
    NProgress.set(0.4)
    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
      errorMessage.value = 'すべてのフィールドを入力してください。'
      NProgress.done()
      return
    }
  
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = '新しいパスワードと確認用パスワードが一致しません。'
      NProgress.done()
      return
    }
  
    try {
      const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/changePassword', {
        email: sessionStorage.getItem('email'),
        password : currentPassword.value,
        newpassword: newPassword.value,
        confirmpassword: confirmPassword.value,
      }, {
        headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
      })
  
      if (response.status === 200) {
        // Handle success
        errorMessage.value = ''
        router.push('/admin/login')
      } else {
        errorMessage.value = 'サーバーに接続できません。後でもう一度やり直してください。'
      }
    } catch (error) {
      errorMessage.value = 'パスワードの変更に失敗しました。'
      console.error('Change password error:', error)
    } finally {
      password.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      NProgress.done()
    }
  }
  const clearError = () => {
  errorMessage.value = ''
}
  onMounted(() => {
    code.value = route.query.code;
  });
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
    margin-top: 12px;
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
  