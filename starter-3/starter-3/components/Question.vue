<template>
  <div class="question-component" @click="isLastQuestion && $emit('addNewQuestion')">
    <router-link :to="{ path: '/Admin/AddQuestion', props: { id: id } }" class="question-id">
      <span>{{ id }}</span>
    </router-link>

    <router-link :to="{ path: '/Admin/AddQuestion', props: { id: id } }" class="question-text" :style="{ color: questionTextColor }">
  <span>{{ questionText }}</span>
</router-link>


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
import { defineProps, ref, computed } from 'vue';

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
  },
  isLastQuestion: Boolean
});

const questionTextColor = computed(() => {
  return props.floor === null ? '#BDBDBD' : '#1A1A1A';
});

const showModal = ref(false);

const deleteQuestion = () => {
  showModal.value = true;
};

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
  border: 1px solid #D9D9D9;
  width: 769px;
  height: 58px;
  gap: 0px;
  border-radius: 8px;
  overflow: hidden;
}

.question-id {
  display: flex;
  justify-content: center;
  align-items: center;
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
  padding: 18px 0 15px 12px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: left;
}

.floor-number {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.floor-button {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  margin-right: 8px;
  width: 71px;
  height: 34px;
  padding: 6px 0px 6px 0px;
  gap: 10px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  color: #C8C8C8;
}

.delete-icon {
  width: 34px;
  height: 34px;
  background-image: url('@/assets/images/bin.svg');
  background-size: cover;
}

.modal {
  position: fixed;
  width: 592px;
  height: 266px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 24px;
  gap: 10px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
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
  margin-top: 0;
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
  display: flex;
  gap: 16px;
}

.confirm-button,
.cancel-button {
  border-radius: 112px;
  cursor: pointer;
  width: 259px;
  height: 56px;
}

.confirm-button {
  background-color: #E13A4B;
  color: white;
}

.cancel-button {
  background-color: white;
  color: #E13A4B;
  border: 1px solid #E13A4B;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Media Query for Responsiveness */
@media (max-width: 600px) {
  .modal {
    width: 90%;
    height: auto;
    padding: 20px;
  }

  .modal-title {
    font-size: 24px;
    line-height: 32px;
  }

  .modal-buttons {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .confirm-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
