<template>
  <div class="scroll-container">
    <Question
      v-for="(question, index) in questions"
      :key="index"
      :id="question.id"
      :questionText="question.question_name"
      :floor="question.floor"
      @delete="handleDelete"
      :isLastQuestion="index === questions.length - 1"
      @addNewQuestion="addNewQuestion"
      :questionIndex="index"
      :style="{ marginBottom: '12px' }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Question from './Question.vue';
import axios from 'axios';

const questions = ref([{"id":1718184326,"question_name":"着物を着る文化的伝統がある国はどこですか?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_1","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-12T09:25:26Z","updated_at":"2024-06-12T09:25:26Z"},{"id":1718094630,"question_name":"着物を着る文化的伝統がある国はどこですか?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_3","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T08:30:30Z","updated_at":"2024-06-11T08:30:30Z"},{"id":1718097380,"question_name":"着物を着る文化的伝統がある国はどこですか?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_3","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T09:16:20Z","updated_at":"2024-06-11T09:16:20Z"},{"id":1718099693,"question_name":"着物を着る文化的伝統がある国はどこですか?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_3","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T09:54:53Z","updated_at":"2024-06-11T09:54:53Z"},{"id":1718185606,"question_name":"Quốc gia nào có truyền thống văn hóa mặc áo kimono?","correct_answer_explain":"Tokyo nằm ở phía đông nam của đảo chính Honshu, là một phần của vùng Kantō, bao gồm cả quần đảo Izu và quần đảo Ogasawara. Tokyo được đặt tên là Edo vào thời kỳ của Tokugawa Ieyasu.","correct_answer_name":"option_3","options":{"option_1":"Tây Ban Nha","option_2":"Liên Xô","option_3":"Nhật Bản","option_4":"Brasil"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-12T09:46:46Z","updated_at":"2024-06-12T09:46:46Z"},{"id":1718100642,"question_name":"123","correct_answer_explain":"123","correct_answer_name":"1231231","options":{"option_1":"12312312312","option_2":"123312","option_3":"12312312312","option_4":"123213123"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T10:10:42Z","updated_at":"2024-06-11T10:10:42Z"},{"id":1718100655,"question_name":"123","correct_answer_explain":"123","correct_answer_name":"1231231","options":{"option_1":"12312312312","option_2":"123312","option_3":"12312312312","option_4":"123213123"},"floor":123,"banner_url":"123123123","footer_url":"123123","qrcode_url":"12312321","created_at":"2024-06-11T10:10:55Z","updated_at":"2024-06-11T10:10:55Z"},{"id":1718099704,"question_name":"着物を着る文化的伝統がある国はどこですか?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_3","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T09:55:04Z","updated_at":"2024-06-11T09:55:04Z"},{"id":1718100551,"question_name":"thuyen?","correct_answer_explain":"東京は、本州の南東部にある関東地方の一部であり、伊豆諸島と小笠原諸島が含まれています。東京が江戸と名付けられたのは、徳川家康の時代でした。","correct_answer_name":"option_3","options":{"option_1":"スペインの国","option_2":"ソビエトの国","option_3":"日本の国","option_4":"ブラジルという国"},"floor":1,"banner_url":"https://example.com/banner.jpg","footer_url":"https://example.com/footer.jpg","qrcode_url":"https://example.com/qrcode.jpg","created_at":"2024-06-11T10:09:11Z","updated_at":"2024-06-11T10:09:11Z"}]);

const fetchQuestionsFromAPI = async () => {
  try {
    // const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions');
    // questions.value = response.data.map(question => ({
    //   id: question.id,
    //   question_name: question.question_name,
    //   floor: question.floor
    // }));
    // // Thêm dòng câu hỏi mới "+ さらに質問を" vào cuối danh sách
    // questions.value.push({ id: questions.value.length + 1, question_name: '+ さらに質問を', floor: null });
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Xử lý lỗi khi gọi API thất bại
  }
};

// Gọi hàm fetchQuestionsFromAPI khi component được mounted
fetchQuestionsFromAPI();

const handleDelete = (id) => {
  questions.value = questions.value.filter(question => question.id !== id);
};

const addNewQuestion = () => {
  const lastQuestion = questions.value[questions.value.length - 1];
  const newId = lastQuestion.id + 1;
  const newQuestionquestion_name = `質問番号 ${newId}`;
  
  // Cập nhật nội dung của câu hỏi thứ 10 thành "質問番号 10"
  questions.value[questions.value.length - 1].question_name = `質問番号 ${lastQuestion.id}`;

  // Thêm câu hỏi mới với nội dung "+ さらに質問を"
  questions.value.push({ id: newId, question_name: '+ さらに質問を', floor: null });
};
</script>

<style scoped>
/* Add any required styles here */

/* For small devices such as phones */
@media (max-width: 576px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}

/* For medium devices such as tablets */
@media (min-width: 577px) and (max-width: 768px) {
  .question-component {
    width: 100%; /* Set width to 100% for smaller width */
  }
}

/* For large devices such as laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  .question-component {
    width: 100%; /* Set width to 100% for medium width */
  }
}

/* For extra small devices such as small phones */
@media (max-width: 425px) {
  .question-component {
    width: 100%; /* Set width to 100% for full width */
  }
}
</style>
