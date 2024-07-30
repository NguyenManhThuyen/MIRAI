<template>
  <div v-if="showComponent" class="custom-component">
    <!-- Phần tiêu đề -->
    <div class="title-section">
      <p class="title-text">
        <template v-if="title">{{ title.title }}</template>
        <SkeletonLoader v-else />
      </p>
    </div>

    <div class="content-section">
      <p class="content-title">
        <template v-if="title">{{ title.content }}</template>
        <SkeletonLoader v-else />
      </p>
      <div class="icon-container" @click="openEdit1Modal">
        <img src="@/assets/images/admin-home-edit-icon.svg" class="edit-icon" loading="lazy" />
      </div>
    </div>

    <!-- Thanh ngang xám -->
    <div class="gray-line"></div>

    <div class="title-section">
      <p class="title-text">
        <template v-if="notificationTitle">{{ notificationTitle.title }}</template>
        <SkeletonLoader v-else />
      </p>
      <div class="switch-container">
        <label class="switch">
          <input type="checkbox" v-model="switchValue" @change="handleSliderChange" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="content-section">
      <p class="title-text-temp">
        <template v-if="notificationTitle">{{ notificationTitle.content }}</template>
        <SkeletonLoader v-else />
      </p>
      <div class="icon-container" @click="openEdit2Modal">
        <img src="@/assets/images/admin-home-edit-icon.svg" class="edit-icon" loading="lazy" />
      </div>
    </div>

    <!-- Thanh ngang xám -->
    <div class="gray-line"></div>

    <BodyAdminHomeListQuestion />

    <!-- Modal -->
    <div v-if="showModal" class="modal-container" @click="handleOverlayClick($event)">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">{{ modalTitle }}</p>
          <img src="@/assets/images/admin-home-change-topic-icon-plus.svg" class="close-icon" @click="closeModal" />
        </div>
        <div class="modal-body">
          <!-- Nội dung của modal -->
          <textarea v-model="modalContent" class="modal-textarea" style="resize: none;"></textarea>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">キャンセル</button>
          <button class="save-button" @click="saveModalChanges">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import NProgress from 'nprogress';
import { toast } from 'vue3-toastify';
import SkeletonLoader from '@/components/SkeletonLoader.vue'; // Đảm bảo đường dẫn đúng

const showComponent = ref(false);
const title = ref(null);
const notificationTitle = ref(null);
const switchValue = ref(false);
const showModal = ref(false);

let modalTitle = ref('');
let modalContent = ref('');
let modalType = ref('');

const fetchData = async () => {
  NProgress.start();
  NProgress.set(0.4);
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda');
    response.data.forEach(item => {
      if (item.type === 'title') {
        title.value = item;
      } else if (item.type === 'noti') {
        notificationTitle.value = item;
      }
    });
    switchValue.value = notificationTitle.value.noti;
    nextTick(() => {
      showComponent.value = true;
      NProgress.done();
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    NProgress.done();
  }
};

const openEdit1Modal = () => {
  showModal.value = true;
  modalType.value = 'title';
  modalTitle.value = title.value.title;
  modalContent.value = title.value.content;
};

const openEdit2Modal = () => {
  showModal.value = true;
  modalType.value = 'noti';
  modalTitle.value = notificationTitle.value.title;
  modalContent.value = notificationTitle.value.content;
};

const closeModal = () => {
  showModal.value = false;
  modalTitle.value = '';
  modalContent.value = '';
};

const saveModalChanges = () => {
  NProgress.start();
  NProgress.set(0.4);
  let dataToUpdate = modalType.value === 'title' ? title.value : notificationTitle.value;
  axios.put('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda', {
    ...dataToUpdate
  })
    .then(response => {
      NProgress.done();
      closeModal();
      toast.success("質更新に成功");
    })
    .catch(error => {
      toast.error("アップデートに失敗しました");
    });
};

const handleSliderChange = () => {
  NProgress.start();
  NProgress.set(0.4);
  const apiUrl = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/${switchValue.value}`;
  axios.put(apiUrl)
    .then(response => {
      toast.success("質更新に成功");
    })
    .catch(error => {
      toast.error("アップデートに失敗しました");
    });
  NProgress.done();
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

onMounted(fetchData);
</script>
  

<style scoped>
.custom-component {
    border-radius: 8px;
    background-color: #FFFFFF;
}

.title-section {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.title-text {
    font-family: Noto Sans JP;
    font-size: 16px;
    font-weight: 700;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #6A6A6A;
    margin-right: 10px;
}

.icon-container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.edit-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}

.edit-icon:hover {
  transform: scale(1.2); /* Phóng to khi di chuột vào */
}

.edit-icon:active {
  transform: scale(1); /* Phóng to khi di chuột vào */
}

.content-section {
    margin-top: 10px;
    display: flex;
    width: fit-content;
    height: fit-content;
    background-color:  #F1F4F9;
    padding: 9px 16px 9px 16px;
    gap: 10px;
    border-radius: 8px;
    text-align: center;
    justify-content: center;
    margin-bottom: 10px;
}

.content-title {
    font-family: Noto Sans JP;
    font-size: 20px;
    font-weight: 700;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color:#4B4B4D;
    overflow: hidden;
}

.title-text-temp {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  background-color:  #F1F4F9;
  margin: 0;
  padding: 3.5px 0; /* Đảm bảo không có khoảng cách dư thừa */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.switch-container {
    display: inline-block;
    margin-right: 12px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 22px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 22px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:checked+.slider:before {
    transform: translateX(13.5px);
}

.gray-line {
    border-bottom: 1px solid #E3E4EC;
}

/* Modal styles */
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu nền mờ */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 80%;
    max-width: 595px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Đổ bóng cho modal */

    gap: 58px;
    border-radius: 24px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}

.modal-title {
    font-size: 18px;
    font-weight: 700;
}
.modal-body {
    display: flex;
    text-align: left;
    justify-content: left;
}
.modal-textarea {
    width: 100%;
    min-height: 128px; /* Đặt chiều cao tối thiểu của textarea */
    border: none;
    outline: none;

    font-family: Noto Sans JP;
    font-size: 20px;
    font-weight: 400;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    color:#4B4B4D;
    background-color:  #F1F4F9;

    padding: 12px 16px 12px 16px;
    gap: 10px;
    border-radius: 8px;
    margin-bottom: 48px;
}


.close-icon {
    cursor: pointer;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-button, .save-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;

    width: fit-content;
    min-width: 151px;
    height: 48px;
    padding: 8px;
    gap: 4px;
    border-radius: 8px;


    font-family: Noto Sans JP;
    font-size: 16px;
    font-weight: 400;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;

}

.cancel-button {
    background-color:transparent;
    color:  #2E7CF6;
}

.save-button {
    background-color:  #2E7CF6;
    color: white;
}

@media (max-width: 480px) {
  .content-title {
    font-family: Noto Sans JP;
    font-size: 18px;
    font-weight: 600;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color:#4B4B4D;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
}
</style>
