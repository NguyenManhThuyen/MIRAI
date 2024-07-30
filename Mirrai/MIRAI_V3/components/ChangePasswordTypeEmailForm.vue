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
  import { useRouter } from 'vue-router'
  import { onMounted, onUnmounted } from 'vue'
  import NProgress from 'nprogress'
  import { toast } from 'vue3-toastify';

  const email = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  const router = useRouter()
  const handleSubmit = async () => {
    NProgress.start()
    NProgress.set(0.4)
    if (!email.value) {
      errorMessage.value = '電子メールを入力してください。'
      return
    }
  
    try {
      const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/sendCode', {
        email: email.value,
      }, {
        headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*' }
      })
  
      if (response.status === 200) {
        successMessage.value = 'パスワードリセットメールを送信しました。'
        errorMessage.value = ''
        email.value = ''

        toast.promise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1); // delay 2 giây để đảm bảo toast có thời gian hiển thị
          }),
          {
            pending: 'メールを送信しています..',
            success: 'メールの送信に成功しました',
            error: 'メールの送信に失敗しました'
          }
        ).then(() => {
          router.push('/admin/login');
        });

      } else {
        errorMessage.value = 'サーバーに接続できません。後でもう一度やり直してください。'
        successMessage.value = ''
      }
    } catch (error) {
      errorMessage.value = '電子メールが無効であるか、このアカウントは存在しません。'
      successMessage.value = ''
      } finally {
      NProgress.done()
    }
  }


    // Thêm event listener khi component được mounted
  onMounted(() => {
    // Đóng lỗi khi click ra ngoài form hoặc các thao tác khác trên trang
    document.addEventListener('click', closeError)
  })

  // Loại bỏ event listener khi component bị unmounted để tránh memory leak
  onUnmounted(() => {
    document.removeEventListener('click', closeError)
  })

  // Hàm xử lý đóng lỗi
  const closeError = () => {
    errorMessage.value = '' // Đặt lại giá trị lỗi thành rỗng
    successMessage.value = ''
  }
  // Watch for changes in the `code` input to hide the error message
  watch(email.value, () => {
    errorMessage.value = ''
  })

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
    margin-bottom: 60px;
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
    margin-bottom: 24px;
    position: relative;
  }
  
  .input-group input {
    border: 1px solid #ccc;
    border-radius: 12px;
    width: 100%;
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
  
  button {
    width: 100%;
    height: 56px;
    background-color: #2E7CF6;
    color: #fff;
    border: none;
    padding: 14px;
    border-radius: 12px;
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
  