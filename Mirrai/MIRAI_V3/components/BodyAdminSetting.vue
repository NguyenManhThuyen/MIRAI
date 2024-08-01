<template>
  <div class="total">
    <h1 class="password-title">デジタル壁紙</h1>
    <div class="content">
      <div :class="['change-image', { 'alternative-size': !uploadedQuestionImage }]">
        <template v-if="uploadedQuestionImage">
          <img :src="uploadedQuestionImage" class="uploaded-image" @click="openModal" />
        </template>
        <template v-else>
          <img src="@/assets/images/admin-create-question-icon.svg" class="upload-icon" @click="openModal" />
        </template>
      </div>
      <div class="button-container">
        <button @click="openModal" class="change-image-button">画像を追加</button>
      </div>
    </div>

    <div class="gray-line"></div>

    <h1 class="password-title">パスワード</h1>
    <div class="change-password" @click="openPasswordModal">
      <span>パスワードを変更する</span>
      <img src="@/assets/images/arrow-right-icon.svg" class="arrow-icon">
    </div>
    <div class="gray-line"></div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container-img">
        <h3>デジタル壁紙画像を選択</h3>
        <span class="modal-close" @click="closeModal">×</span>
        <div class="image-upload">
          <template v-if="uploadedQuestionImagee">
            <img :src="uploadedQuestionImagee" class="uploaded-image" @click="triggerFileQuestionInput" />
            <div class="button-container">
              <button @click="triggerFileQuestionInput" class="change-image-button">画像変更</button>
              <input type="file" ref="fileQuestionInput" @change="onQuestionFileChange" style="display: none;" />
            </div>
          </template>
          <template v-else>
            <img src="@/assets/images/admin-create-question-icon.svg" class="upload-icon" />
            <p>ドラッグ&ドロップでファイルをアップロードする又はブラウザ</p>
            <label class="choose-file">
              データから選択
              <input type="file" @change="onQuestionFileChange" style="display: none;" />
            </label>
          </template>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">消去</button>
          <button class="save-button" @click="saveImage">保存</button>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-container">
        <h2 class="modal-title">パスワードを変更する</h2>
        <span class="modal-close" @click="closePasswordModal">×</span>
        <div class="input-group">
          <input type="password" placeholder="現在のパスワード" v-model="currentPassword">
        </div>
        <div class="input-group">
          <input :type="showNewPassword ? 'text' : 'password'" placeholder="新しいパスワード" v-model="newPassword">
          <img @click="toggleNewPasswordVisibility" src="@/assets/images/admin-remove-red-eye.svg">
        </div>
        <div class="input-group">
          <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="パスワードの確認" v-model="confirmPassword">
          <img @click="toggleConfirmPasswordVisibility" src="@/assets/images/admin-remove-red-eye.svg">
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <button class="modal-button" @click="changePassword">パスワードを変更する</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import pica from 'pica';
import NProgress from 'nprogress';

const showModal = ref(false);
const showPasswordModal = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');

const imageQuestion = ref('');
const uploadedQuestionImage = ref('');
const uploadedQuestionImagee = ref('');

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  errorMessage.value = '';
};

const openPasswordModal = () => {
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  errorMessage.value = '';
};

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validateInputs = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'すべてのフィールドに入力してください';
    return false;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '新しいパスワードと確認パスワードが一致しません';
    return false;
  }
  errorMessage.value = '';
  return true;
};

const changePassword = async () => {
  if (!validateInputs()) {
    return;
  }

  try {
    const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/changePassword', {
      email: sessionStorage.getItem('email'),
      password: currentPassword.value,
      newpassword: newPassword.value,
      confirmpassword: confirmPassword.value,
    });

    if (response.status === 200) {
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      errorMessage.value = '';
      toast.success("パスワードが正常に変更されました");
      showPasswordModal.value = false;
    }
  } catch (error) {
    if (error.response) {
      // Các lỗi từ server
      if (error.response.status >= 400 && error.response.status < 500) {
        errorMessage.value = 'クライアントエラーが発生しました。';
      } else if (error.response.status >= 500) {
        errorMessage.value = 'システムエラーが発生しました。';
      }
    } else {
      // Các lỗi khác
      errorMessage.value = 'エラーが発生しました。';
    }
  }
};

const triggerFileQuestionInput = () => {
  document.querySelector('input[type="file"]').click();
};

const onQuestionFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    // Kiểm tra kích thước file
    if (file.size > 1024 * 1024) {
      // Tạo một đối tượng ảnh từ file
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        // Tạo canvas để resize ảnh
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Đặt kích thước mới cho canvas
        const scaleFactor = Math.sqrt((1024 * 1024) / file.size);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        // Resize ảnh bằng pica
        const picaInstance = pica();
        await picaInstance.resize(img, canvas);
        
        // Chuyển đổi canvas thành base64
        canvas.toBlob(async (blob) => {
          const base64String = (await toBase64(blob)).replace(/^data:image\/[a-z]+;base64,/, '');
          imageQuestion.value = base64String;
          uploadedQuestionImagee.value = URL.createObjectURL(blob);
        }, 'image/jpeg', 0.8); // Giảm chất lượng ảnh để giảm kích thước
      };
    } else {
      uploadedQuestionImagee.value = URL.createObjectURL(file);
      imageQuestion.value = (await toBase64(file)).replace(/^data:image\/[a-z]+;base64,/, '');
    }
  }
};

const saveImage = async () => {
  if(uploadedQuestionImage.value) {
    try {
      const response = await axios.put('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda', {
        id: 3,
        title: "",
        content: imageQuestion.value, // Gửi ảnh đã xử lý
        type: "stamp",
        updated_user: 1233,
        noti: true
      });

      if (response.status === 200) {
        toast.success('画像が正常に保存されました');
        uploadedQuestionImage.value = uploadedQuestionImagee.value;
        closeModal(); // Đóng modal sau khi lưu thành công
      } else {
        toast.error('画像の保存中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('画像の保存中にエラーが発生しました');
    }
  } else {
    try {
      const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda', {
        id: 3,
        title: "",
        content: imageQuestion.value, // Gửi ảnh đã xử lý
        type: "stamp",
        updated_user: 1233,
        noti: true
      });

      if (response.status === 200) {
        toast.success('画像が正常に保存されました');
        uploadedQuestionImage.value = uploadedQuestionImagee.value;
        closeModal(); // Đóng modal sau khi lưu thành công
      } else {
        toast.error('画像の保存中にエラーが発生しました');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('画像の保存中にエラーが発生しました');
    }
  }
 
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};


onMounted(async () => {
  NProgress.start();
  NProgress.set(0.4);

  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/3');
    uploadedQuestionImage.value = getFullImageUrl(response.data.content);
    uploadedQuestionImagee.value = uploadedQuestionImage.value;
    console.log(getFullImageUrl(uploadedQuestionImage.value))
  } catch (error) {
    console.error('Error fetching subtitle:', error);
  }
  NProgress.done();
});

</script>


<style scoped>
.total {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: self-start;
  margin-left: 6%;
  margin-right: 6%;
}

.change-image{
  display: flex;
  flex-direction: column;
  justify-content: center; /* căn giữa theo chiều ngang */
  text-align: center; /* căn giữa nội dung trong phần tử */
  align-items: center; /* căn giữa theo chiều dọc */
  width: auto;
  max-width: 192px;
  height: fit-content;
  background-color: #F1F4F9;
  border-radius: 16px;
  overflow: hidden; /* Đảm bảo ảnh không vượt ra ngoài div */
}

.alternative-size {
  width: 192px;
  height: 304px;
}

.upload-icon {
  display: flex;
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  width: 56px;
  height: 40px;
  justify-content: center; /* căn giữa theo chiều ngang */
  text-align: center; /* căn giữa nội dung trong phần tử */
  align-items: center; /* căn giữa theo chiều dọc */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 12px;
}

.uploaded-image {
  max-width: 100%; /* Đảm bảo ảnh không vượt quá chiều rộng của div */
  max-height: 100%; /* Đảm bảo ảnh không vượt quá chiều cao của div */
  object-fit: contain; /* Căn chỉnh ảnh trong div */
  cursor: pointer;
  border-radius: 16px;
}

.password-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  font-family: 'Noto Sans JP';
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  text-align: left;
  color: #292D32;
  margin-top: -8px;
  margin-bottom: 16px;
}

.change-password {
  display: flex;
  justify-content: space-between;
  height: 72px;
  width: 100%;
  cursor: pointer;
  align-items: center;
  background-color: #F1F4F9;
  padding: 24px 25px 24px 25px;
  border-radius: 12px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin-left: 5px;
}

.gray-line {
  width: 100%;
  margin: 16px 0;
  border-bottom: 1px solid #E3E4EC;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: #ffffff;
  width: 90%;
  max-width: 430px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  padding:  32px;
  gap: 21px;
  border-radius: 16px;
  border: 1px solid #D9D9D9;
}

.modal-container-img {
  background-color: #ffffff;
  width: 90%;
  max-width: 669px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  padding:  32px;
  gap: 21px;
  border-radius: 16px;
  border: 1px solid #D9D9D9;
}


.modal-title {
  margin: 0px 24px 24px 24px;
  font-family: Noto Sans JP;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  color: #2E7CF6;
}

.modal-close {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  margin-right: 4px;
}

.input-group {
  display: flex;
  margin-bottom: 12px;
  position: relative;
  padding: 9px 18px 9px 18px;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid #D9D9D9;
  height: 48px;
}

.input-group input {
  width: calc(100% - 10px);
  height: 28px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  outline: none;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: left;
  color: #BBBBBB;
}

.input-group img {
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.change-image-button {
  margin-top: 10px;
  background-color: transparent;
  color: #2E7CF6;
  border: none;
  border-radius: 4px;
  height: 20px;
  cursor: pointer;
}

.modal-button {
  width: 100%;
  background-color: #2E7CF6;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 16px;
  padding: 14px; /* Có thể gộp tất cả padding lại thành 14px */
  border-radius: 12px;
  height: 48px;
  text-align: center;
  display: flex;
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  justify-content: center; /* Căn giữa nội dung theo chiều ngang */
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
}

.modal-container-img h3 {
  display: flex;
  justify-content: left;
  margin: 12px 0;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  
  color: #292D32;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  border: 2px dashed #ccc;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  background-color: #F1F4F9;
  padding: 21px;
  gap: 10px;
  border-radius: 16px;
}

.image-upload input[type="file"] {
  width: 100%; /* Chiều rộng của input là 100% */
  margin-left: auto; /* Căn phần tử sang phải */
  margin-right: auto; /* Căn phần tử sang trái */
  font-size: 0; /* Ẩn văn bản "No file chosen" */
  opacity: 0; /* Ẩn văn bản "No file chosen" */
}

.image-upload label.choose-file {
  display: inline-block;
  background-color: transparent;
  color: #8F8F96;
  cursor: pointer;
  border: 1px solid #4F5A62;
  border-radius: 4px;

  padding: 10px 20px 10px 20px;
  gap: 8px;
  border-radius: 7px;

  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}

.image-upload label.choose-file:hover {
  transform: scale(1.02);
}

.image-upload p {
  width: auto;
  max-width: 364px;
  margin-left: auto; /* Căn phần tử sang phải */
  margin-right: auto; /* Căn phần tử sang trái */
  margin-bottom: 12px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: #8F8F96;
  line-height: 1.8;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 22.4px;
  text-align: center;
  height: 48px;
  width: 96px;
}

.cancel-button {
  background-color: #fff;
  color: red;
}

.save-button {
  background-color: #2E7CF6;
  color: #fff;
}

.cancel-button:hover {
  background-color: #f8d7da;
}

.save-button:hover {
  background-color: #1e6ab0;
}

@media screen and (max-width: 768px) {
  .modal-container {
    padding: 32px 24px 24px 24px;
  }
}

@media screen and (max-width: 576px) {
  .modal-container {
    padding: 32px 16px 24px 16px;
  }
}

@media screen and (max-width: 425px) {
  .modal-container {
    padding: 32px 12px 24px 12px;
  }
}

</style>
