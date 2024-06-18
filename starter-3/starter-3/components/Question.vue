<template>
  <div class="question-component" @click="isLastQuestion && $emit('addNewQuestion')">
    <router-link :to="`/Admin/AddQuestion`" class="question-id" @click="saveAdminQuestionID">
      <span>{{ questionIndex + 1 }}</span>
    </router-link>

    <router-link
      :to="`/Admin/AddQuestion`"
      class="question-text"
      :style="{ color: questionTextColor }"
      @click="saveAdminQuestionID"
    >
      <span>{{ questionText }}</span>
    </router-link>

    <!-- Thêm điều kiện v-if để ẩn floor-number -->
    <div class="floor-number" v-if="shouldDisplayFloorNumber">
      <button class="floor-button">{{ floor }}階</button>
      <button @click="deleteQuestion" class="delete-icon"></button>
    </div>

    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2 class="modal-title">質問番号 {{ floor }} を削除しますか?</h2>
        <p class="modal-subtitle">システムは{{ floor }} 階の質問を削除する</p>
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
import { defineProps, defineEmits, computed, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  key: {
    type: Number,
    required: true,
  },
  questionIndex: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  isLastQuestion: Boolean,
});

const emit = defineEmits(['delete', 'addNewQuestion']);

const questionTextColor = computed(() => {
  return (props.questionText === '+ さらに質問を' || props.questionText === `質問番号${props.questionIndex + 1}`) ? '#BDBDBD' : '#1A1A1A';
});

const router = useRouter();
const showModal = ref(false);

const saveAdminQuestionID = () => {
  localStorage.setItem('adminQuestionIDCurrent', props.id.toString());

  // Xóa AnswerDataPayload và dataPayload từ local storage
  localStorage.removeItem('method')
  localStorage.removeItem('AnswerDataPayload');
  localStorage.removeItem('dataPayload');

  if (props.questionText === '+ さらに質問を') {
    localStorage.setItem('method', 'POST');
  } else {
    localStorage.setItem('method', 'PUT');
  }
};

const deleteQuestion = () => {
  showModal.value = true;
};

const confirmDelete = async () => {
  try {
    await axios.delete(
      `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${props.id}`
    );
    emit('delete', props.id);
    showModal.value = false;
    // Không cần reload trang sau khi xóa
    // router.go();
  } catch (error) {
    console.error('Error deleting question:', error);
    // Handle error
  } finally {
    showModal.value = false;
  }
};

const cancelDelete = () => {
  showModal.value = false;
};

// Theo dõi sự thay đổi trong props.questionText để xác định liệu có hiển thị floor-number hay không
const shouldDisplayFloorNumber = computed(() => {
  return props.questionText !== '+ さらに質問を';
});

// Watch for changes in props.questionText and fetch new questions from API if needed
watch(() => props.questionText, async () => {
  // Perform an API call to fetch new questions
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    
    const updatedQuestions = response.data.map(question => ({
      id: question.id,
      question_name: question.question_name,
      floor: question.floor
    }));

    // Add new question "+ さらに質問を" at the end of the list
    updatedQuestions.push({ id: updatedQuestions.length + 1, question_name: '+ さらに質問を', floor: null });

    // Sort questions by floor in ascending order
    updatedQuestions.sort((a, b) => (a.floor === null ? Infinity : a.floor) - (b.floor === null ? Infinity : b.floor));

    // Update the local questions list
    questions.value = updatedQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Handle error
  }
});
</script>


<style scoped>
.question-component {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
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
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 23.17px;
  text-align: left;
}

.question-text {
  flex: 1;
  padding: 18px 0 15px 12px;
  font-family: "Noto Sans JP", sans-serif;
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
  font-family: "Noto Sans JP", sans-serif;
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
  border: 1px solid #d9d9d9;
  color: #c8c8c8;
}

.delete-icon {
  width: 34px;
  height: 34px;
  background-image: url("@/assets/images/bin.svg");
  background-size: cover;
}

.modal {
  position: fixed;
  width: 592px;
  height: auto;
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
  color: #e13a4b;
  margin-top: 0;
  margin-bottom: 12px;
}

.modal-subtitle {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  text-align: center;
  color: #1a1a1a;
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
  background-color: #e13a4b;
  color: white;
}

.cancel-button {
  background-color: white;
  color: #e13a4b;
  border: 1px solid #e13a4b;
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
