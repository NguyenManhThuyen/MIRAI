<template>
  <header class="admin-header">
    <div class="admin-icon-container">
      <img src="@/assets/images/mirai-icon.svg" class="admin-header-icon" />
      <p class="admin-main-text">JAL Admin</p>
    </div>
    <div class="admin-logout-button">
      <button class="logout-button" @click="logout">
        <span class="button-text">ログアウト</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-header {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #FFFFFF; /* White background */
  border-bottom: 1px solid #E0E0E0; /* Light gray border */
}

.admin-icon-container {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.admin-icon-container img {
  width: 40px;
  height: 40px;
}

.admin-icon-container p {
  margin-left: 12px;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 7000;
  line-height: 28px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #000000;
}

.admin-header-icon {
  width: 32px;
  height: 32px;
}

.admin-main-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.02em;
  color: #4B4B4D; /* Dark gray color */
}

.admin-logout-button {
  margin-right: 16px;
}

.logout-button {
  width: fit-content;
  height: 39px;
  padding: 8px 12px;
  gap: 10px;
  border-radius: 8px;
  background-color: #E13A4B;
  color: white;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  cursor: pointer;
  border: none;
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}

.logout-button:hover {
  transform: scale(1.1); /* Phóng to khi di chuột vào */
}

.logout-button:active {
  transform: scale(1); /* Thu nhỏ lại khi nhấn nút */
}
</style>
