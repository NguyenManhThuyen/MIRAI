<template>
  <div class="total">
    <h1 class="password-title">パスワード</h1>
    <div class="change-password" @click="openModal">
      <span>パスワードを変更する</span>
      <img src="@/assets/images/arrow-right-icon.svg" class="arrow-icon">
    </div>
    <div class="gray-line"></div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <h2 class="modal-title">パスワードを変更する</h2>
        <span class="modal-close" @click="closeModal">×</span>
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


<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      showModal: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      errorMessage: '',
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.errorMessage = '';
    },
    closeModal() {
      this.showModal = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    validateInputs() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.errorMessage = 'すべてのフィールドに入力してください';
        return false;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = '新しいパスワードと確認パスワードが一致しません';
        return false;
      }
      this.errorMessage = '';
      return true;
    },
    async changePassword() {
      if (!this.validateInputs()) {
        return;
      }

      try {
        const response = await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/changePassword', {
          email: sessionStorage.getItem('email'),
          password: this.currentPassword,
          newpassword: this.newPassword,
          confirmpassword: this.confirmPassword,
        });

        if (response.status === 200) {
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.errorMessage = '';
          toast.success("パスワードが正常に変更されました");
          this.showModal = false;
        }
      } catch (error) {
        if (error.response) {
          // Các lỗi từ server
          if (error.response.status >= 400 && error.response.status < 500) {
            this.errorMessage = 'クライアントエラーが発生しました。';
          } else if (error.response.status >= 500) {
            this.errorMessage = 'システムエラーが発生しました。';
          }
        } else {
          // Các lỗi khác
          this.errorMessage = 'エラーが発生しました。';
        }
      }
    }
  }
};

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
  margin-top: 16px;
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
  width: 80%;
  max-width: 430px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  padding:  32px;
  gap: 21px;
  border-radius: 16px;
  border: 1px solid #D9D9D9;
}

.modal-title {
  margin-bottom: 24px;
  font-family: Verdana;
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #2E7CF6;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
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
  width: calc(100% - 40px);
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
  margin-right: 0px;
}

.modal-button {
  width: 100%;
  background-color: #2E7CF6;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 16px;
  padding: 14px 14px 14px 14px;
  gap: 10px;
  border-radius: 12px;
  min-height: 48px;
  height: fit-content;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
}



</style>
