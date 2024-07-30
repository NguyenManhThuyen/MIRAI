<template>
  <div class="quiz-container">
    <HeaderStampQuestionUser :admin="true" />
    <div class="quiz-body">
      <img 
      v-if="question.image_question" 
      :src="getFullImageUrl(question.image_question)" 
      loading="lazy" 
      alt="Hình ảnh câu hỏi"
    />
    
    <!-- Bộ giữ chỗ khi hình ảnh chưa tải -->
    <SkeletonLoader v-else />
    
      <div class="question-text">
        <h2>問題{{ question.sort }}:</h2>
      </div>
      <p class="question-name">{{ question.title }}</p>

      <div class="answers">
        <div
          class="answer-option"
          v-for="(answer, index) in answers"
          :key="index"
          @click="selectAnswer(index)"
          :class="{ 'selected': selectedAnswer === index }"
        >
          <button
            :class="'option-' + String.fromCharCode(65 + index) + (selectedAnswer === index && animationTrigger ? ' hover-animation' : '')"
            :style="{ transform: selectedAnswer === index ? 'scale(1.2)' : '' }"
          >{{ String.fromCharCode(65 + index) }}</button>
          <p>{{ answer.content }}</p>
        </div>
      </div>
    </div>
    <AlertComponent
      v-if="showAlert"
      :content="alertContent"
      :actionText="actionText"
      :visible="showAlert"
      @cancel="handleAlertCancel"
      @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NProgress from 'nprogress';
import { v4 as uuidv4 } from 'uuid';

definePageMeta({
  layout: "users",
});

const router = useRouter();
const route = useRoute();

const question = ref({});
const answers = ref([]);
const id = ref('');
const selectedAnswer = ref(null);
const questionsCount = ref(0);
const showAlert = ref(false);
const alertContent = ref('');
const actionText = ref('');
const animationTrigger = ref(false); // Thêm ref để quản lý trạng thái animation

let validIds = ref([]);
let results = JSON.parse(localStorage.getItem('results')) || [];
let userId = localStorage.getItem('user_id') || uuidv4();
localStorage.setItem('user_id', userId);

const fetchQuestion = async (id) => {
  NProgress.start();
  NProgress.set(0.4);
  
  try {
    const [response, responseQuestion, responseAnswer] = await Promise.all([
      axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions'),
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${id.value}`),
      axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-answers-lambda/${id.value}`)
    ]);

    question.value = responseQuestion.data;
    answers.value = responseAnswer.data;
    questionsCount.value = response.data.length;
    validIds = response.data.map(item => item.id);
  } catch (error) {
    console.error('Error fetching question:', error);
  } finally {
    NProgress.done();
  }
};

const selectAnswer = (index) => {
  if (selectedAnswer.value !== null) {
    return; // Prevent changing the answer if one is already selected
  }
  
  selectedAnswer.value = index;
  
  const answer = String.fromCharCode(65 + index);
  alertContent.value = `${answer}で回答を確定します`;
  actionText.value = 'はい';
  showAlert.value = true;
};

const handleAlertCancel = () => {
  selectedAnswer.value = null;
  showAlert.value = false;
};

const handleAlertConfirm = async () => {
  showAlert.value = false;
  animationTrigger.value = true; // Kích hoạt animation

  const isCorrect = answers.value[selectedAnswer.value].is_correct;
  const result = {
    id: id.value,
    status: isCorrect
  };

  results.push(result);

  const logAnswer = results.reduce((acc, curr) => {
    acc[curr.id] = curr.status;
    return acc;
  }, {});

  const analysisData = [{
    id: userId,
    log_answer: logAnswer
  }];

  try {
    await axios.post('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda', analysisData);
  } catch (error) {
    console.error('Error posting analysis data:', error);
  }

  const resultsLength = results.length;
  let apiUrl = 'https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-statistic-lambda';
  let requestBody = {};

  if (resultsLength === 1) {
    requestBody = { status: 0 };
  } else if (resultsLength === questionsCount.value) {
    requestBody = { status: 1 };
  }

  if (Object.keys(requestBody).length > 0) {
    try {
      await axios.post(apiUrl, requestBody);
    } catch (error) {
      console.error('Error posting statistic data:', error);
    }
  }
  setTimeout(() => {
    if (isCorrect) {
      router.push({
        path: '/users/questionCorrect',
        query: {
          answer: String.fromCharCode(65 + selectedAnswer.value),
          content: answers.value[selectedAnswer.value].content,
          explain: question.value.content,
          explainImg: question.value.image_explain,
          questionsCount: questionsCount.value
        }
      });
    } else {
      const correctAnswerIndex = answers.value.findIndex(answer => answer.is_correct);
      router.push({
        path: '/users/questionIncorrect',
        query: {
          answer: String.fromCharCode(65 + selectedAnswer.value),
          content: answers.value[selectedAnswer.value].content,
          correctAnswer: String.fromCharCode(65 + correctAnswerIndex),
          correctAnswerContent: answers.value[correctAnswerIndex].content,
          explain: question.value.content,
          explainImg: question.value.image_explain,
          questionsCount: questionsCount.value
        }
      });
    }

    const filteredResults = results.filter(result => validIds.includes(parseInt(result.id, 10)));
    localStorage.setItem('results', JSON.stringify(filteredResults));
  }, 3000); 

  const filteredResults = results.filter(result => validIds.includes(parseInt(result.id, 10)));
  localStorage.setItem('results', JSON.stringify(filteredResults));
};

const getFullImageUrl = (url) => {
  const prefix = "https://mirai-static-website.s3.ap-southeast-1.amazonaws.com/";
  return prefix + url;
};

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

onMounted(() => {
  id.value = route.query.id;

  const currentDate = getCurrentDate();
  const isFirstLogin = localStorage.getItem('is_first_login');
  
  if (!isFirstLogin) {
    localStorage.setItem('is_first_login', currentDate);
  } else if (isFirstLogin !== currentDate) {
    localStorage.setItem('is_first_login', currentDate);
    localStorage.removeItem('results');
    localStorage.removeItem('user_id');
    results = [];
  }

  const isAnswered = results.some(result => result.id === id.value);
  
  if (isAnswered) {
    alert('この問題にはすでに回答しました。');
    router.push('/users/questionResult');
  } else {
    fetchQuestion(id);
  }
});
</script>

<style scoped>
.quiz-container {
  text-align: center;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.quiz-navigation button {
  margin: 0.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1; 
}

.quiz-body img {
  width: 100%;
  height: auto;
}

.question-text {
  margin: 10px 0;
}

.question-text h2 {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #626263;
}

.question-name {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
  margin: 12px 16px;
}

.answers {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.answer-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 78px;
  border-bottom: 1px solid #E3E4EC;
  transition: background-color 0.3s;
  position: relative;
}

.answer-option:last-child {
  border-bottom: none;
}

.answer-option.selected {
  background-color: #F1F4F9;
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

.answers button {
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

.answers button.hover-animation {
  animation: hover-animation 1.5s infinite alternate;
}

@keyframes hover-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>