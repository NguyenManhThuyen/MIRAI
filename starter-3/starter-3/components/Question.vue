<!-- components/question.vue -->
<template>
  <div class="question-component">
    <router-link :to="{ path: '/Admin/AddQuestion', props: { id: id } }" class="question-id">
  <span>{{ id }}</span>
</router-link>

<div class="question-text" :style="{ color: questionTextColor }">
  <p>{{ questionText }}</p>
</div>
    <div class="floor-number">
      <button class="floor-button">{{ floor }}階</button>
      <button @click="deleteQuestion" class="delete-icon"></button>
    </div>
    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2 class="modal-title">質問番号 {{ id }} を削除しますか?</h2>
        <p class="modal-subtitle">システムは質問番号 {{ id }} を削除します</p>
        <div class="modal-buttons">
          <button class="cancel-button" @click="cancelDelete">キャンセル</button>
          <button class="confirm-button" @click="confirmDelete">確認する</button>
        </div>
      </div>
    </div>
    <div class="overlay" v-if="showModal"></div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  }
});

const questionTextColor = computed(() => {
  return props.floor === null ? '#BDBDBD' : '#1A1A1A';
});

const emit = defineEmits(['delete']);

const deleteQuestion = () => {
  showModal.value = true;
};

const showModal = ref(false);

const confirmDelete = () => {
  emit('delete', props.id);
  showModal.value = false;
};

const cancelDelete = () => {
  showModal.value = false;
};
</script>

<style scoped>
.question-component {
  display: flex;
  align-items: center;
  border: 1px solid #D9D9D9; /* Sửa lại màu border */
  width: 769px; /* Đặt lại chiều rộng */
  height: 58px; /* Đặt lại chiều cao */
  gap: 0px;
  border-radius: 8px; /* Đặt lại border-radius */
  overflow: hidden; /* Ẩn phần màu đỏ nằm ngoài border-radius */
}

.question-id {
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  background-color: red;
  color: white;
  height: 100%;
  width: 56px;
  padding: 10px;
  border-radius: 8px 0 0 8px;
}

.question-id span {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 23.17px;
  text-align: left;
}

.question-text {
  flex: 1;
  padding: 18px 0 15px 12px; /* Top 18px, Bottom 15px, Left 12px */
  font-family: 'Noto Sans JP', sans-serif; /* Font family */
  font-size: 16px; /* Font size */
  font-weight: 500; /* Font weight */
  line-height: 23.17px; /* Line height */
  text-align: left; /* Text alignment */
}

.floor-number {
  display: flex; /* Sử dụng flexbox để căn chỉnh các nút */
  align-items: center; /* Căn giữa các nút theo chiều dọc */
  margin-right: 12px; /* Khoảng cách bên phải */
}

.floor-button {
  font-family: 'Noto Sans JP', sans-serif; /* Font family */
  font-size: 16px; /* Font size */
  font-weight: 500; /* Font weight */
  line-height: 22.4px; /* Line height */
  text-align: center; /* Text alignment */
  margin-right: 8px; /* Khoảng cách giữa nút floor và delete-icon */
  width: 71px; /* Chiều rộng tự động để phù hợp với nội dung */
  height: 34px;
  padding: 6px 0px 6px 0px;
  gap: 10px;
  border-radius: 4px;
  border: 1px 0px 0px 0px;
  opacity: 0px;
  border: 1px solid #D9D9D9;
  color: #C8C8C8;
}

.delete-icon {
  width: 34px; /* Đặt kích thước cho thùng rác */
  height: 34px;
  background-image: url('@/assets/images/bin.svg'); /* Đường dẫn tới ảnh thùng rác mới */
  background-size: cover;
}

.modal {
  position: fixed;
  width: 592px;
  height: 266px;
  top: 50%; /* Đặt top là 50% */
  left: 50%; /* Đặt left là 50% */
  transform: translate(-50%, -50%); /* Dịch chuyển modal điều chỉnh vị trí chính giữa */
  padding: 40px 24px;
  gap: 10px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 999; /* Đảm bảo modal hiển thị trên cùng */
  display: flex;
  align-items: center;
  flex-direction: column;
}


.modal-title {
  font-family: Verdana;
  font-size: 40px;
  font-weight: 700;
  line-height: 56px;
  text-align: center;
  color: #E13A4B;
  margin-top: 0; /* Đặt margin-top là 0 để căn tiêu đề lên trên cùng */
  margin-bottom: 12px;
}

.modal-subtitle {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  color: #1A1A1A;
}

.modal-content {
  text-align: center;
}

.modal-buttons {
  margin-top: 40px;
}

.confirm-button,
.cancel-button {
  border-radius: 6px;
  cursor: pointer;
}

.confirm-button {
  width: 259px;
  height: 56px;
  gap: 10px; /* Khoảng cách giữa nút */
  border-radius: 112px; /* Bo tròn góc cho nút */
  background-color: #E13A4B; /* Màu đỏ */
  color: white; 
}

.cancel-button {
  width: 259px;
  height: 56px;
  gap: 10px; /* Khoảng cách giữa nút */
  border-radius: 112px ; /* Bo tròn góc cho nút */
  background-color: white; /* Màu đỏ */
  color: #E13A4B;
  border: 1px solid #E13A4B; /* Viền màu đỏ 1px */
  margin-right: 16px; /* Khoảng cách bên phải 16px */
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Màu làm mờ với độ trong suốt 50% */
  z-index: 998; /* Đảm bảo overlay hiển thị phía dưới modal */
}

</style>
