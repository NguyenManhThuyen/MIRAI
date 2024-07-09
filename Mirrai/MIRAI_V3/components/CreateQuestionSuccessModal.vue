<template>
  <div v-if="visible" class="modal" @click="handleOverlayClick($event)">
    <div class="modal-content">
      <span class="modal-close" @click="close">×</span>
      <h2 class="modal-title">正常に作成できました！</h2>
      <img :src="newQuestion?.qrcode" alt="QR Code" class="modal-qrcode"/>
      <button class="modal-download" @click="downloadQRCode">ダウンロード</button>
      <div class="modal-input-container">
        <input type="text" :value="`http://192.168.11.199:3000/users/question?id=${newQuestion.id}`" class="modal-input" readonly ref="inputToCopy"/>
        <img src="@/assets/images/copy-icon.svg" alt="Icon" class="modal-input-icon" @click="copyInputValue"/>
      </div>
      <img :src="imageQuestionUrl" alt="Question Image" class="modal-question-image"/>
      <p class="modal-question-sort">問題{{ newQuestion?.sort }}:</p>
      <p class="modal-question-title">{{ newQuestion?.title }}</p>

      <div
        class="answer-option"
        v-for="(answer, index) in answersResponse"
        :key="index"
        :class="{ 'last-answer-option': index === answersResponse.length - 1 }"
      >
        <div :class="{ 'option-index': true, 'option-correct': answer.is_correct }">{{ String.fromCharCode(65 + index) }}</div>
        <p :class="{ 'option-correct': answer.is_correct }">{{ answer.content }}</p>
      </div>
      
      <button class="modal-ok-button" @click="handleOkClick">OKです</button>

    </div>
  </div>
</template>

<script setup>
import { toRefs, onMounted, ref, unref } from 'vue';
const props = defineProps({
  visible: Boolean,
  newQuestion: Object,
  answersResponse: Object
});
const { visible, newQuestion, answersResponse } = toRefs(props);

const emit = defineEmits(['close', 'ok']);

const close = () => {
  emit('close');
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    close(); 
  }
};

const handleOkClick = () => {
  emit('close');
};

const inputToCopy = ref(null);

const copyInputValue = () => {
  const inputElement = unref(inputToCopy);
  if (inputElement) {
    inputElement.select();
    document.execCommand('copy');
  }
};

const imageQuestionUrl = computed(() => {
  if (newQuestion.value && newQuestion.value.image_question) {
    return `data:image/png;base64,${newQuestion.value.image_question}`;
  }
  return '';
});

const downloadQRCode = () => {
  const link = document.createElement('a');
  link.href = newQuestion.value.qrcode;
  link.download = 'qrcode.png';
  link.click();
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
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

.modal-content {
  background: #fff;
  max-width: 642px;
  width: 100%;
  position: relative;
  padding: 32px;
  gap: 20px;
  border-radius: 16px;
  max-height: 85vh;
  overflow-y: auto;

  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  text-align: center;
}

.modal-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #000000;
  margin-bottom: 10px;
}

.modal-qrcode {
    display: block;
    margin: 0 auto;
    height: 120px;
}

.modal-download {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #2E7CF6;
  display: block;
  margin: 10px auto;
  border: none;
  background-color: transparent;
}

.modal-input-container {
  position: relative;
  display: flex;
  align-items: center;
  height: auto;
  min-height: 48px;
}

.modal-input {
  flex: 1;
  height: auto;
  min-height: 48px;
  border: none;
  outline: none;
  background-color:  #F1F4F9;
  border-radius: 8px;
  padding :10px 12px 10px  12px;
  gap : 10px;

  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  text-align: left;
  color: #97979F;
}


.modal-input-icon {
  position: absolute;
  right: 10px;
}

.modal-question-image {
  display: block;
  margin: 20px auto;
  border-radius: 20px;
  width: 100%;
}

.modal-question-sort {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #626263;
  margin-bottom: 12px;
}

.modal-question-title {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
}

.answers {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.answer-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 78px;
  border-bottom: 1px solid #E3E4EC;
  position: relative;
}

.answer-option p {
  padding-left: 12px;
  margin-right: 16px;
  flex: 1;
  text-align: left;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  color: #4B4B4D;
}

.option-index {
  width: 40px;
  height: 40px;
  border: 2px solid #D6D6D6;
  background-color: white;
  color: #0082CA;
  border-radius: 50%;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}

.option-index.option-correct {
  color: red; /* Đổi màu chữ thành đỏ cho câu trả lời đúng */
}

p.option-correct {
  color: red; /* Đổi màu chữ thành đỏ cho câu trả lời đúng */
}

/* Loại bỏ border-bottom cho phần tử cuối cùng */
.last-answer-option {
  border-bottom: none;
}

.modal-ok-button {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #FFFFFF;
  background-color: #2E7CF6;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  text-align: center;
}

.modal-ok-button:hover {
  background-color: #005AA7;
}

</style>
