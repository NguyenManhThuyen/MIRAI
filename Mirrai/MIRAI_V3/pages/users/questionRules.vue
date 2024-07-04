<template>
  <div class="quiz-container">
    <HeaderQuestionUser />
    <div class="quiz-body">
      <div class="terms-title">利用規約と条件</div>
      <p class="terms-text">
        App Store を使用する場合は、以下に同意するものとします。
        <br/>
        App Store は個人的および非営利目的にのみ使用できます。
        <br/>
        他人の Apple ID アカウントを作成したり、他人の Apple ID アカウントを使用したりすることはできません。
        <br/>
        Apple ID アカウントでのすべてのアクティビティについては、お客様が責任を負います。
        <br/>
        法律に違反するアプリケーション、または App Store の利用規約に違反するアプリケーションをダウンロードまたは使用することはできません。
        <br/>
        App Store からダウンロードしたアプリケーションを変更、再配布、販売することはできません。
        <br/>
        Apple は、App Store からアプリケーションをいつでも削除する権利を留保します。
        <br/>
        Apple は、App Store の利用規約をいつでも変更する権利を留保します。
        <br/>
        あなたは、App Store の利用規約への違反から生じるすべての損害および損失から Apple および第三者を補償することに同意します。
      </p>
      <button class="back-button" @click="goBack">
        <span class="button-icon"></span> 前のページに戻る
      </button>
    </div>
    <FooterQuestionUser />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<style scoped>
.quiz-container {
  text-align: center;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.quiz-body {
  margin: 16px 41px 16px 41px;
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

.terms-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 34.75px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.terms-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: left;
  color: #6A6A6A;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 38px;
  border-radius: 49px;
  background-color: #31d0aa;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #ffffff;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.back-button .button-icon {
  width: 24px; /* Kích thước của biểu tượng */
  height: 24px;
  background-image: url('@/assets/images/Arrow - Right 2.svg'); /* Đường dẫn đến biểu tượng Arrow - Right 2 */
  background-size: cover;
  margin-right: 10px; /* Khoảng cách giữa biểu tượng và văn bản */
}

.back-button:hover {
  background-color: #1eae8a; /* Màu nền khi hover */
}
</style>
