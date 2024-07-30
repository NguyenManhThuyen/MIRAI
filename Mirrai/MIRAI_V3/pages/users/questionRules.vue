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
          <img src="@/assets/images/arrow-right-blue-icon.svg">
          前のページに戻る
        </button>
    </div>
    <FooterQuestionUser :hideTerms="true"/>
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
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.quiz-body {
  margin: 16px 41px 10px 41px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
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
  margin-bottom: 12px;
}
.download-button text {
  display: flex;
  justify-content: center;
  text-align: center;
  justify-items: center;
  margin-bottom: 2px;
}
.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 38px;
  gap: 10px;
  border-radius: 49px 0 0 0;
  opacity: 1;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #0082CA;
  border: none;
  cursor: pointer;
  background-color: transparent;
  margin-top: 10px;
}
</style>
