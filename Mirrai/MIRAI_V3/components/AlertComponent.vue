<template>
  <div class="alert-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="alert-box" @click.stop>
      <h2 class="alert-title">{{ title }}</h2>
      <p class="alert-content">{{ content }}</p>
      <div class="alert-actions">
        <button class="alert-button cancel" @click="cancelAction">キャンセル</button>
        <button
          :class="['alert-button', actionText.toLowerCase() === 'delete' ? 'delete' : 'action']"
          @click="confirmAction"
        >
          {{ actionText === 'Delete' ? '確認する' : actionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps(['title', 'content', 'actionText', 'visible']);
const emit = defineEmits(['cancel', 'confirm']);

const handleOverlayClick = () => {
  emit('cancel');
};

const cancelAction = () => {
  emit('cancel');
};

const confirmAction = () => {
  toast.success("質問は正常に削除されました");
  emit('confirm');
};
</script>

  <style scoped>
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .alert-box {
    background: white;
    width: 343px;
    height: 204px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .alert-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .alert-content {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .alert-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .alert-button {
    width: 48%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
  }
  
  .alert-button.cancel {
    background-color: #ffffff;
    border: 1px solid #D7DBE8;
    width: Fill (141.5px)px;
    height: Hug (40px)px;
    padding: 10px 16px 10px 16px;
    gap: 10px;
    border-radius: 8px;
  }
  
  .alert-button.delete {
    background-color: #E13A4B;
    color: white;
    width: Fill (141.5px)px;
    height: Hug (40px)px;
    padding: 10px 16px 10px 16px;
    gap: 10px;
    border-radius: 8px;
  }
  
  .alert-button.action {
    background-color: #2E7CF6;
    color: white;
    width: Fill (141.5px)px;
    height: Hug (40px)px;
    padding: 10px 16px 10px 16px;
    gap: 10px;
    border-radius: 8px;
  }

  .alert-button:hover {
    transform: scale(1.05); /* Phóng to khi di chuột vào */
  }

  .alert-button:active {
    transform: scale(1); /* Phóng to khi di chuột vào */
  }

  </style>
  