<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <HeaderStampQuestionUser :numberOfQuestions="6" :currentQuestion="3" />
    <div class="quiz-body">
      <!-- Ảnh question-correct.svg -->
      <img src="@/assets/images/question-incorrect.svg" />

      <!-- Text câu trả lời của người dùng  -->
      <div class="user-answer">
        <span class="answer-text">あなたの回答：</span>
        <div class="circle">A</div>
        <span class="answer-text">箱根</span>
      </div>

      <span class="correct-answer-title">正解は : </span>

      <!-- Text câu trả lời đúng -->
      <div class="correct-answer">
        <div class="circle">B</div>
        <span class="answer-text">箱根</span>
      </div>

      <!-- Phần giải thích -->
      <div class="explanation">
        <div class="gray-background">
          <div class="section-title">解説</div>
          <img src="@/assets/images/question-correct-explain.svg" />
          <div class="explanation-text">
            <p>
              名古屋テレビ塔は、2020年9月にリニューアルされ、「中部電力 MIRAI TOWER」として再オープンしました。中部電力 MIRAI TOWERは、日本で最初の集約電波塔で、名古屋市の中心部に位置し、多くの観光客や地元の人々に親しまれています。以下は、中部電力 MIRAI TOWERについての詳細な解説です。
            </p>
            <br />
            <p>
              中部電力 MIRAI TOWERは、名古屋市の象徴的な建造物として、多くの人々に愛されています。リニューアルにより、さらに魅力的な観光スポットとなり、訪れる価値が一層高まりました。名古屋を訪れる際には、ぜひ立ち寄ってみてください。
            </p>
          </div>
        </div>
        <div class="gray-background-footer">
          <div class="next-question">
            次の問題に到着したらカメラを立ち上げてQRを読み込んでね！
          </div>
          <img src="@/assets/images/question-correct-uemiya.svg" class="qr-code" />
        </div>
      </div>
    </div>
    <FooterQuestionUser />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';;
</script>

<style scoped>
.quiz-container {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  min-height: 100vh; /* Đảm bảo chiếm toàn bộ chiều cao của viewport */
  display: flex;
  flex-direction: column;
}

.quiz-body {
  margin-top: 8px;
  flex-grow: 1;
}

.quiz-body img {
  width: 100%;
  max-height: 300px;
}

.user-answer {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 8px 12px;
  border-radius: 15.32px;
  margin: 0px 16px;
  text-align: center;
  justify-content: center;
}

.user-answer .circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FFFFFF;
  margin-right: 12px;

  color: #0082CA;
  border: 2.67px solid #D6D6D6;

  font-family: Noto Sans JP;
  font-size: 26.67px;
  font-weight: 700;
  line-height: 38.61px;
  letter-spacing: 0.02em;
  text-align: center;

}

.user-answer .answer-text {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: left;
}

.correct-answer-title {
  margin-left: 16px;
  margin-bottom: 10px;
  text-align: left;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  letter-spacing: 0.02em;
}

.correct-answer {
  display: flex;
  align-items: center;
  background-color: #F1F4F9;
  height: 64px;
  padding: 8px 12px;
  border-radius: 15.32px;
  margin: 0px 16px;
}


.correct-answer .circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FFFFFF;

  color: #E23437;
  border: 2.67px solid #D6D6D6;

  font-family: Noto Sans JP;
  font-size: 26.67px;
  font-weight: 700;
  line-height: 38.61px;
  letter-spacing: 0.02em;
  text-align: center;

}

.correct-answer .answer-text {
  font-family: Noto Sans JP;
  font-size: 24px;
  font-weight: 700;
  line-height: 34.75px;
  text-align: left;
  color: #E23437;
  margin-left: 16px;
}

.explanation {
  margin-top: 8px;
  position: relative;
  padding-top: 8px;

  /* Tạo dashline */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%; /* Đưa dashline về giữa */
    transform: translateX(-50%); /* Dịch chuyển dashline về trái 50% của chính nó */
    width: calc(100% - 32px); /* Chiều rộng của dashline, trừ bớt padding */
    border-top: 2px dashed #ccc;
  }
}


.gray-background {
  background-color: #f0f0f0;
  padding: 16px;
  gap: 12px;
  border-radius: 23px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: left;
}

.section-title img {
  width: 100%; /* Đảm bảo ảnh chiếm toàn bộ chiều rộng của phần tử chứa */
  height: auto; /* Đảm bảo ảnh duy trì tỷ lệ khung hình */
  object-fit: contain; /* Đảm bảo ảnh vừa với phần tử chứa mà không bị cắt */
}

.explanation-text {
  text-align: left;
  margin-top: 12px;
  font-size: 16px;
  line-height: 24px;
}

.gray-background-footer {
  display: flex;
  background-color: #f0f0f0;
  padding: 16px;
  margin: 8px 16px 48px 16px ;
  gap: 12px;
  border-radius: 23px;
  align-items: center;
  justify-content: space-between;
}

.next-question {
  font-size: 18px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #0082CA;
}

.gray-background-footer img {
  max-width: 35px;
}

.qr-code {
  max-width: 100%;
  height: auto;
}
</style>
