<template>
  <div class="terms-container">
    <h2 class="custom-title">利用規約と条件</h2>
    <div class="terms-content">
      <div class="terms-paragraph">
        App Storeを使用する場合は、以下に同意するものとします。
      </div>
      <div class="terms-paragraph">
        App Storeは個人的および非営利目的にのみ使用できます。
      </div>
      <div class="terms-paragraph">
        他人のApple IDアカウントを作成したり、他人のApple
        IDアカウントを使用したりすることはできません。
      </div>
      <div class="terms-paragraph">
        Apple IDアカウントでのすべてのアクティビティについては、お客様が責任を負います。
      </div>
      <div class="terms-paragraph">
        法律に違反するアプリケーション、またはApp
        Storeの利用規約に違反するアプリケーションをダウンロードまたは使用することはできません。
      </div>
      <div class="terms-paragraph">
        App
        Storeからダウンロードしたアプリケーションを変更、再配布、販売することはできません。
      </div>
      <div class="terms-paragraph">
        Appleは、App Storeからアプリケーションをいつでも削除する権利を留保します。
      </div>
      <div class="terms-paragraph">
        Appleは、App Storeの利用規約をいつでも変更する権利を留保します。
      </div>
      <div class="terms-paragraph">
        あなたは、App
        Storeの利用規約への違反から生じるすべての損害および損失からAppleおよび第三者を補償することに同意します。
      </div>
    </div>
    <div class="terms-actions">
      <input type="checkbox" id="agree" v-model="isAgreed" />
      <label for="agree">規約を確認する</label>
    </div>
    <div class="button-container">
      <button @click="disagree" class="btn-disagree">同意しない</button>
      <button @click="agree" :disabled="!isAgreed" class="btn-agree">同意する</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAgreed: false,
    };
  },
  methods: {
    disagree() {
      this.$router.go(-1); // Quay lại trang trước đó
    },

    agree() {
      if (this.isAgreed) {
        this.$router.push("/quiz/0");
      }
    },
  },
  name: "HomeUser",
};
</script>

<style scoped>
.terms-container {
  width: 343px;
  height: 607px;
  padding-top: 0px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.custom-title {
  font-family: Noto Sans JP;
  font-size: 24px;
  font-weight: 700;
  line-height: 34.75px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #1a1a1a;
}

h2 {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0px;
  height: 35px;
}

.terms-content {
  padding: 16px 16px 0px 16px;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: left;
  color: #6a6a6a;
}

.terms-actions {
  display: flex;
  align-items: left;
  justify-content: flex-start;
  margin-top: 12px;
  margin-left: 16px; /* Đây là lề trái 16px */
  margin-right: 18px;
}

.terms-actions input[type="checkbox"] {
  width: 18px; /* Đặt chiều rộng của checkbox */
  height: 18px; /* Đặt chiều cao của checkbox */
  border: 3px solid #6a6a6a; /* Xác định viền với độ dày 3px và màu sắc */
  margin-right: 4px; /* Cách label 4px */
}

.terms-actions label {
  font-family: Noto Sans JP; /* Đặt font chữ */
  font-size: 14px; /* Đặt kích thước font */
  font-weight: 500; /* Đặt độ đậm của font */
  line-height: 20.27px; /* Đặt khoảng cách dòng giữa các dòng */
  letter-spacing: 0.02em; /* Đặt khoảng cách giữa các ký tự */
  text-align: left; /* Căn giữa nội dung của label */
  color: #6a6a6a;
}

.button-container {
  align-items: center;
  height: 40px;
  justify-content: space-between;
  margin-top: auto; /* Đưa button container xuống dưới cùng */
  margin-left: 16px; /* Cách trái 18px */
  margin-right: 16px; /* Cách phải 18px */
  border-top: 1px solid #dae6da94; /* Thêm viền top với màu #c8e4c6 */
}

.btn-disagree {
  color: #1a1a1a;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-right: 50%; /* 左寄せ */
}

.btn-agree {
  color: #1a1a1a;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-right: 0px; /* Đưa nút agree về phía lề phải */
}

.btn-agree:disabled {
  color: #c8c8c8;
  cursor: not-allowed;
}
</style>
