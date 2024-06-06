<template>
  <div class="notification">
    <div class="notification-content">
      <div class="notification-items">
        <div class="svg-container">
          <img src="@/assets/images/cloud_left.svg" class="svg-image left" alt="Cloud Left" />
        </div>
        <div class="question-text">質問 {{ questionId }}</div>
        <div class="svg-container">
          <img src="@/assets/images/cloud_right.svg" class="svg-image right" alt="Cloud Right" />
        </div>
      </div>
    </div>
    <div class="notification-image">
      <div class="text">
        トップになりましょう！ ギフトが待たされるよ！
      </div>
    </div>
    <img src="@/assets/images/happy-giftbox.svg" class="correct-image" alt="Correct" />
    <div class="correct-answer-container">
      <div class="correct-answer">{{ trueAnswerQuestion }}/{{ totalQuestion }}</div>
    </div>

    <div class="custom-text">
      （この画面を審査員にご提示いただき、正解数に応じてプレゼントを差し上げます。）
    </div>
    <button class="custom-button">
      <span class="button-content">
        <img src="@/assets/images/share.svg" class="share" alt="share" />
        共有
      </span>
    </button>
    
    
  </div>
</template>

  <script>
  export default {
    props: {
      questionId: {
        type: Number,
        required: true
      },
      trueAnswerQuestion: {
        type: Number,
        required: true
      },
      totalQuestion: {
        type: Number,
        required: true
      }
    },
    name: "HappyGiftBox"
  };
  </script>
  
  <style scoped>
  .notification {
    display: flex;
    flex-direction: column;
    width: 343px;
    height: auto;
    padding: 16px 0px 24px 0px;
    border-radius: 16px;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
  }
  /* Thêm đoạn này để canh giữa nút */
  .notification .custom-button {
    display: flex;
    justify-content: center;
    margin-top: auto; /* Đảm bảo nút được căn sát lề dưới */
  }
  
  .notification-content {
    position: relative;
  }
  
  .notification-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin: 0 16.5px; /* Sử dụng margin bên ngoài thay vì padding */
  }
  
  .question-text {
    margin-top: 5.1px;
    opacity: 1;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    color: #E13A4B;
  }

  
  .text {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 23.17px;
    letter-spacing: 0.01em;
    text-align: center;
    margin-top: 24px; /* Khoảng cách từ phần text đến phần trên cùng của notification */
  }
  
  .notification-image {
    display: flex;
    justify-content: center;
    margin-left: 46px;
    margin-right: 46px;
  }
  
  
  .correct-image {
    display: block;
    margin: 0 auto;
  }
  
  .correct-answer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
  }
  
  .correct-answer {
    width: 149px;
    height: 39px;
    padding: 8px 43px;
    opacity: 1;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 23.17px;
    text-align: center;
    color: #E13A4B;
    border-top: 1px solid #DADADA;
    border-bottom: 1px solid #DADADA;
  }

  
  
  .custom-text {
    width: 100%;
    height: 80px;
    opacity: 1;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20.27px;
    text-align: center;
    margin-top: 16px;
    max-width: 60px;
    margin-left: auto;
    margin-right: auto;
    color: #6A6A6A;
    max-width: 264px;
    margin-bottom: 32px;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .share {
    margin-right: 8px; /* Khoảng cách giữa ảnh và chữ */
  }
  

  .custom-button {
    width: 135px;
    height: 44px;
    border-radius: 112px;
    opacity: 1;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    color: #FFFFFF;
    background-color: #E13A4B;
  
  }

  .share {
    width: 15px; /* Đặt chiều rộng mong muốn */
    height: 16.6px; /* Đặt chiều cao mong muốn */
  }
  
  </style>
  