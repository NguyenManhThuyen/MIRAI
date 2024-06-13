<template>
  <div class="login-page">
    <div class="login-banner">
      <div class="banner-text">ル・ヴァン・サン</div>
    </div>
    
    <div class="parent-component">
      <HeaderAddQuestion :id="3"/>
    </div>

    <div class="body">
      <div class="question-label">質問 {{ localFloor }}</div>

      <div class="qr-code-container">
        <img src="@/assets/images/assignment-turned-in-red.svg" alt="QR Code" class="qr-code-image">
        <div class="qr-code-text">正しい答えを選択してください</div>
      </div>

      <div class="answer-list">
        <template v-if="options && options.length > 0">
          <label v-for="(option, index) in options" :key="index" class="answer-item">
            <input type="radio" name="answer" :value="index + 1" :checked="index + 1 === selectedOption">
            <span class="answer-text">{{ option.text || 'null' }}</span>
          </label>
        </template>
        <template v-else>
          <p>Loading options...</p>
        </template>
      </div>

      <div class="generate">
        <button @click="saveAnswer" class="generate-button generate-button-text">次に</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAddQuestion from '@/components/HeaderAddQuestion.vue';
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';

export default {
  props: {
    questionId: {
      type: Number,
      required: true,
    },
    correctAnswerExplain: {
      type: String,
      default: "",
    },
  },
  components: {
    HeaderAddQuestion,
  },
  setup() {
    const router = useRouter();
    const options = ref([]);
    const localFloor = ref(null);
    const qrcodeUrl = ref("");
    const bannerUrl = ref("");
    const footerUrl = ref("");
    const questionText = ref("");
    const correctAnswerExplain = ref("");
    const id = ref("");

    const selectedOption = computed(() => {
      const savedData = localStorage.getItem('AnswerDataPayload');
      if (savedData) {
        try {
          const dataPayload = JSON.parse(savedData);

          
          // Lặp qua các option để tìm chỉ số của selectedOption
          for (const [index, option] of options.value.entries()) {
            if (option.text === savedData) {
              // Chuyển đổi chỉ số từ chuỗi sang số nguyên và trả về index + 1
              return index + 1;
            }
          }
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
      
      // Trả về mặc định là 1 nếu không có dữ liệu hoặc dữ liệu không hợp lệ
      return 1;
    });


    const fetchQuestionData = () => {
      const savedData = localStorage.getItem('dataPayload');
      if (savedData) {
        try {
          const dataPayload = JSON.parse(savedData);
          localFloor.value = dataPayload.floor;
          qrcodeUrl.value = dataPayload.qrcode_url;
          questionText.value = dataPayload.question_name;
          correctAnswerExplain.value = dataPayload.correct_answer_explain;
          id.value = dataPayload.id;
          bannerUrl.value = dataPayload.banner_url;
          footerUrl.value = dataPayload.footer_url;
          options.value = Object.keys(dataPayload.options).map(key => ({
            text: dataPayload.options[key],
          }));
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      } else {
        console.log('No saved data found in local storage.');
      }

      console.log("right answer getdata", savedData)
    };

    onMounted(() => {
      fetchQuestionData();
    });

    const saveAnswer = () => {
      const selectedAnswer = document.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        const selectedIndex = parseInt(selectedAnswer.value);
        const correctAnswerName = "option_" + selectedIndex;


        const dataPayload = {
          question_name: questionText.value,
          correct_answer_explain: correctAnswerExplain.value,
          correct_answer_name: correctAnswerName,
          options: {
            option_1: options.value[0]?.text,
            option_2: options.value[1]?.text,
            option_3: options.value[2]?.text,
            option_4: options.value[3]?.text,
          },
          floor: localFloor.value,
          qrcode_url: qrcodeUrl.value,
          banner_url: bannerUrl.value,
          footer_url: footerUrl.value,
          id: id.value
        };
        console.log("right answer postdata", dataPayload)
        localStorage.setItem('AnswerDataPayload',options.value[selectedIndex-1]?.text);
        localStorage.setItem('dataPayload',JSON.stringify(dataPayload));
        router.push(`/Admin/DescriptionAnswer`);
        // axios.put('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions', dataPayload)
        //   .then(response => {
        //     console.log('API Response:', response.data);
        //     const id = props.questionId;
        //     router.push(`/Admin/DescriptionAnswer`);
        //   })
        //   .catch(error => {
        //     console.error('Error submitting form:', error);
        //   });
      } else {
        console.log('Please select an answer');
      }
    };

    return {
      options,
      saveAnswer,
      localFloor,
      qrcodeUrl,
      questionText,
      id,
      selectedOption,
    };
  }
};
</script>



  <style scoped>
    /* Banner */
    .login-banner {
      background-color: #E13A4B; /* Màu đỏ */
      margin-top: 0px;
      width: 100%; /* Chiều rộng bằng 100% của trang */
      height: 56px; /* Chiều cao 56px */
    }
    
    /* Trang đăng nhập */
    .login-page {
      background-color: #F9EFE3; /* Màu nền */
      background-image: url('@/assets/images/background.svg'); /* Hình nền */
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      flex-direction: column; /* Sắp xếp theo chiều dọc */
      justify-content: center;
      align-items: center;
      height: 100vh; /* Chiều cao của toàn bộ trang */
      margin: 0;
    }
  
    .banner-text {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 23.17px;
      text-align: center;
      color: white; /* Màu chữ trắng */
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  
    .parent-component {
      display: flex;
      justify-content: center; /* Căn giữa theo chiều ngang */
      align-items: center; /* Căn giữa theo chiều dọc */
      flex-direction: column; /* Sắp xếp theo chiều dọc */
      padding-top: 24px;
      padding-bottom: 24px;
    }
    
    /* Hiển thị questionId */
    .question-id {
      font-size: 18px;
      margin-top: 20px;
    }
  
    /* CSS cho phần body */
    .body {
    width: 819px;
    height: auto; /* Sử dụng chiều cao tự động để nội dung có thể mở rộng */
    padding: 24px;
    gap: 10px;
    border-radius: 16px;
    opacity: 0px;
    background: #FFFFFF;
    margin: 0 auto; /* Canh ra giữa theo chiều ngang */
    display: flex; /* Sử dụng flexbox để căn giữa button */
    flex-direction: column; /* Sắp xếp theo chiều dọc */
    justify-content: center; /* Căn giữa theo chiều dọc */
    align-items: center; /* Căn giữa theo chiều ngang */
  }
  
    /* Hiển thị "質問" với ID câu hỏi */
    .question-label {
      width: fit-content;
      height: 36px;
      padding: 8px 12px;
      gap: 10px;
      border-radius: 44px;
      opacity: 1;
      background: #000000;
      color: white;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-left: auto;
      margin-right: auto;
    }
  
    /* CSS cho QR code container */
    .qr-code-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 12px;
    }
  
    /* CSS cho hình ảnh QR code */
    .qr-code-image {
      width: 24px; /* Điều chỉnh kích thước của hình ảnh QR code */
      height: 24px;
      margin-right: 8px; /* Khoảng cách giữa hình ảnh và văn bản */
    }
  
    /* CSS cho văn bản QR code */
    .qr-code-text {
      font-family: 'Noto Sans JP', sans-serif; /* Sử dụng font-family Noto Sans JP */
      font-size: 24px; /* Đặt kích thước font cho văn bản */
      font-weight: 500; /* Đặt độ đậm cho văn bản */
      line-height: 36px; /* Đặt chiều cao dòng cho văn bản */
      text-align: center; /* Căn giữa văn bản */
      color: #E13A4B; /* Đặt màu cho văn bản */
    }
  
  /* CSS cho nút button và biểu tượng */
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* Đảm bảo nút button chiếm toàn bộ chiều cao của phần bao bọc */
  }
  
  .center-button {
    width: fit-content;
    height: 40px;
    gap: 8px;
    border-radius: 12px;
    border: 1px solid #1A1A1A;
    display: flex;
    align-items: center;
    justify-content: center; /* Căn giữa cả văn bản và biểu tượng */
  }
  
  .icon-plus {
    width: 20px;
    height: 20px;
    margin: 10px 8px 10px 16px;
  }
  
  .button-text {
    font-family: 'Noto Sans JP', sans-serif; /* Sử dụng font-family Noto Sans JP */
    font-size: 16px; /* Đặt kích thước font cho văn bản */
    font-weight: 500; /* Đặt độ đậm cho văn bản */
    line-height: 20px; /* Đặt chiều cao dòng cho văn bản */
    color: #1A1A1A; /* Đặt màu cho văn bản */
    margin-right: 24px;
  }
  
    .generate {
        display: flex;
        justify-content: center;
        margin-top: auto; /* Căn giữa phần .generate xuống dưới cùng */
        margin-bottom: 0px;
    }
    
    .generate-button {
        width: 196px;
        height: 56px;
        padding: 14px 24px; /* Điều chỉnh giá trị padding ở đây */
        gap: 10px;
        border-radius: 112px;
        background: #E13A4B;
        color: white;
    }
    
    
  .generate-button-text {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    text-align: center;
  }
  
  .answer-list {
    display: flex;
    flex-direction: column;
  }
  
   /* Thêm border màu xám 1px giữa các オプション*/
   .answer-item {
    border: 1px solid #ccc;
    border-radius: 112px; /* Sử dụng border-radius để tạo border cong */
    margin-bottom: 8px;
  }
  
  /* Thiết lập kiểu của input radio */
  .answer-item input[type="radio"] {
    display: none; /* Ẩn input radio mặc định */
  }
  
  /* Tùy chỉnh kiểu của input radio đã chọn */
  .answer-item input[type="radio"]:checked + span {
    background: #31D0AA; /* Đổi màu nền khi đã chọn */
    color: white; /* Đổi màu văn bản khi đã chọn */
  }
  
  /* Thiết lập kiểu của label */
  .answer-item span {
    cursor: pointer;
    display: inline-block;
    background: white;
    width: 771px;
    height: 56px;
    padding: 16.36px 24px 15.64px 24px;
    gap: 0px;
    border-radius: 112px;
    opacity: 0px;
  }
/* Thêm dấu check từ ảnh check.svg */
.answer-item input[type="radio"]:checked + span {
    background: #31D0AA;
    color: white;
    position: relative;
    }

    .answer-item input[type="radio"]:checked + span::after {
    content: url('@/assets/images/check.svg');
    position: absolute;
    top: 50%;
    right: 10px; /* Điều chỉnh vị trí dấu check */
    transform: translateY(-50%);
    width: 20px; /* Điều chỉnh kích thước dấu check */
    height: 20px;
    }
  
  </style>
  