<template>
  <div class="container">
    <div class="add-question">
      <div class="add-image">
        <div class="upload-container">
          <!-- Button upload -->
          <button class="upload-button" @click="uploadImage">
            <img class="plus-icon" :src="iconPlus" alt="Plus Icon" />
            <img src="@/assets/images/backgroundd.svg" alt="body" class="body_inner" />
          </button>
          <!-- Error message -->
          <div
            v-if="showErrors && !bannerImageUploaded"
            class="error-message below-upload-button"
          >
            まだバナー画像を追加していません
          </div>
        </div>

        <!-- Uploaded image -->
        <img
          v-if="bannerImageUploaded"
          :src="bannerImage"
          alt="Uploaded Banner Image"
          class="uploaded-image"
        />
      </div>

      <div :class="['floor-display', { 'error-border': showErrors && !localFloor }]">
        <span>階</span>
        <input
          type="number"
          v-model.number="localFloor"
          class="floor-input"
          @input="updateFloor"
        />
      </div>
      <div v-if="showErrors && !localFloor" class="error-message">
        階数が入力されていません
      </div>

      <div class="question-header">
        <span class="question-label">質問 {{ id }}</span>
      </div>

      <div class="question-heading">
        <div class="image-container">
          <img src="@/assets/images/line_help.svg" alt="Image" />
        </div>
        <!-- Thay thế h2 bằng một trường nhập dữ liệu textarea -->
        <textarea
          v-model="questionText"
          class="question-textarea"
          placeholder="質問を追加してください"
        ></textarea>
      </div>
      <div v-if="showErrors && !questionAdded" class="error-message">
        まだ質問を入力していません
      </div>

      <div class="question-section">
        <div v-for="(option, index) in options" :key="index" class="option-row-container">
          <div class="option-row">
            <div class="input-container">
              <input v-model="option.text" :placeholder="'オプション' + (index + 1)" />
            </div>
            <button @click="removeOption(index)" class="remove-button">×</button>
          </div>
          <div v-if="showErrors && optionErrors[index]" class="option-error-message">
            オプションを入力してください
          </div>
        </div>

        <!-- "さらに多くの回答" được hiển thị khi số lượng options không đạt 4 -->
        <div v-if="options.length < 4" class="option-row">
          <div class="input-container">
            <span class="add-option-button" @click="addOption">+ さらに多くの回答</span>
          </div>
        </div>
      </div>

      <div class="footer-image-upload" :style="footerImageStyle">
        <button class="footer-upload-button" @click="uploadFooterImage">
          + フッター画像をダウンロード
        </button>
        <!-- Hiển thị ảnh đã tải lên -->
        <img
          v-if="footerImageUploaded"
          :src="footerImage"
          alt="Uploaded Footer Image"
          class="uploaded-footer-image"
        />
      </div>
      <!-- Hiển thị thông báo lỗi nếu cần -->
      <div v-if="showErrors && !footerImageUploaded" class="error-message">
        フッター画像をまだ追加していません
      </div>
    </div>
    <div class="next-button-container">
      <button class="next-button" @click="validateForm">次に</button>
    </div>
  </div>
</template>
<script>
import { computed, watchEffect } from 'vue'; // Import computed và watchEffect từ Vue

import iconPlus from "@/assets/images/addquesttion.svg";

export default {
  props: {
    id: {
      type: Number,
      //required: true,
    },
    floor: {
      type: Number,
      //required: true,
    },
  },
  data() {
    return {
      localFloor: this.floor,
      options: [{ text: "" }, { text: "" }, { text: "" }],
      optionErrors: [false, false, false],
      remainingOptions: 4,
      iconPlus: iconPlus,
      bannerImage: "",
      bannerImageUploaded: false,
      footerImageUploaded: false,
      questionAdded: false,
      showErrors: false,
      footerImage: "",
      questionData: null,
    };
  },
  mounted() {
    // Sử dụng watchEffect để theo dõi thay đổi trong route.params.id
    watchEffect(() => {
      this.id = Array.isArray(this.$route.params.id) ? this.$route.params.id[0] : this.$route.params.id;
    });
    // Gọi hàm để lấy dữ liệu câu hỏi khi component được mounted
    this.fetchQuestionData();
  },
  methods: {
    async fetchQuestionData() {
      try {
        const response = await axios.get(`https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/questions/${this.id}`);
        
        // Lưu dữ liệu câu hỏi vào biến questionData
        this.questionData = response.data;

        localStorage.setItem('floor', this.questionData.floor);
        
        // In dữ liệu câu hỏi ra console
        console.log('Question Data:', this.questionData);
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    },
    addOption() {
      if (this.options.length >= 0) {
        this.options.push({ text: "" });
        this.remainingOptions -= 1;
        this.optionErrors.push(false); // Thêm một flag mới cho tùy chọn mới
      } else {
        // Hiển thị thông báo khi đã đạt đến số lượng tùy chọn tối đa
        this.options.pop();
        alert("追加できる質問は最大 4 つまでです。");
      }
    },
    removeOption(index) {
      this.options.splice(index, 1);
      this.remainingOptions += 1;
      this.optionErrors.splice(index, 1); // Xóa flag của tùy chọn bị xóa
    },

    updateFloor(event) {
      const value = event.target.value;
      this.localFloor = value;
      this.$emit("update:floor", value);
    },
    validateForm() {
  this.showErrors = true;

  // Validate the form inputs
  const isBannerImageValid = this.bannerImageUploaded;
  const isFloorValid = this.localFloor;
  const isQuestionValid = this.questionText.trim().length > 0;
  const areOptionsValid = this.options.every((option, index) => {
    if (!option.text) {
      this.optionErrors[index] = true;
      return false;
    }
    this.optionErrors[index] = false;
    return true;
  });
  const isFooterImageValid = this.footerImageUploaded;

  // Set the questionAdded flag based on the validation
  this.questionAdded = isQuestionValid;

  if (
    isBannerImageValid &&
    isFloorValid &&
    isQuestionValid &&
    areOptionsValid &&
    isFooterImageValid // Corrected spelling here
  ) {
    alert("Form submitted successfully!");
  } else {
    console.log("Form validation failed.");
  }
},

    uploadImage() {
      // Tạo một input element dạng file
      const input = document.createElement("input");
      input.type = "file";
      // Sét thuộc tính 'onchange' để xử lý việc chọn file
      input.onchange = (e) => {
        const file = e.target.files[0]; // Lấy file đã chọn
        if (file) {
          // Tạo một đối tượng FileReader để đọc file
          const reader = new FileReader();
          reader.onload = (e) => {
            // Khi file được đọc thành công, gán nội dung vào biến bannerImageUploaded và hiển thị ảnh
            this.bannerImageUploaded = true;
            const image = e.target.result;
            this.bannerImage = image; // Gán ảnh đã chọn vào biến bannerImage để hiển thị
          };
          // Đọc file ảnh dưới dạng URL
          reader.readAsDataURL(file);
        }
      };
      // Bắt đầu chọn file khi button được nhấp
      input.click();
    },
    uploadFooterImage() {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Gán ảnh đã chọn vào biến footerImage để hiển thị
            this.footerImage = e.target.result;
            // Đặt flag footerImageUploaded thành true để chỉ ra rằng ảnh đã được tải lên
            this.footerImageUploaded = true;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
  },
};
</script>

<style scoped>
.container {
  width: 819px;
  height: auto;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-question {
  width: 100%;
}

.add-image {
  position: relative;
  height: 184px;
  background: #bdbdbd;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center; /* Căn giữa các phần tử theo chiều ngang */
  margin-bottom: 24px;
}

.upload-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.upload-button {
  position: relative; /* Đặt vị trí của button là relative */
}

.plus-icon {
  position: absolute; /* Đặt vị trí của plus icon là absolute */
  top: 50%; /* Đặt vị trí top là 50% so với button */
  left: 50%; /* Đặt vị trí left là 50% so với button */
  transform: translate(
    -50%,
    -50%
  ); /* Dịch chuyển plus icon điều chỉnh để nằm chính giữa button */
  z-index: 0; /* Đặt z-index cao hơn để plus icon hiển thị phía trên body inner */
}

.inner-icon {
  width: 100%; /* Đảm bảo inner icon lấp đầy toàn bộ button */
  height: 100%;
}

.uploaded-image {
  max-width: 819px; /* Giới hạn chiều rộng tối đa của ảnh */
  max-height: 184px; /* Giới hạn chiều cao tối đa của ảnh */
  z-index: 0;
}

.upload-text {
  font-size: 14px;
  color: white;
  margin-top: 8px;
}

.uploaded-footer-image {
  max-width: 100%;
  max-height: 100%; /* Optional: adjust this if you want to limit the height as well */
  object-fit: contain; /* Scale the image up or down to fit both its width and height within the container */
}

.floor-display {
  display: flex;
  align-items: center;
  border: 1px solid #1a1a1a;
  padding: 4px 8px;
  border-radius: 12px;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 181px;
  height: 52px;
  background-color: transparent;
}

.floor-display span {
  margin-left: 8px;
}

.floor-display input {
  border: 1px solid #8f8989;
  border-radius: 8px;
  padding: 6px 8px;
  width: 51.88px;
  height: 34px;
}

.floor-display.error-border {
  border-color: #e13a4b; /* Thay đổi màu viền khi có lỗi */
}

.question-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed #ff0000; /* Dashed red border */
  margin-bottom: 16px;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 12px;
  padding: 4px; /* Thêm padding để tạo khoảng cách xung quanh nội dung */
}

.image-container {
  margin-right: 16px; /* Adjust as needed */
  padding: 8px; /* Optional padding */
}

.image-container img {
  max-width: 100px; /* Adjust image size as needed */
  max-height: 100px; /* Adjust image size as needed */
}

.question-section {
  margin-bottom: 24px;
  margin-left: 24px;
  margin-right: 24px;
}

.question-header {
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center;
  padding: 8px 8px;
  border-radius: 4px;
}

/* Hiển thị "質問" với ID câu hỏi */
.question-label {
  max-width: 60px;
  max-height: 36px;
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

.options {
  display: flex;
  flex-direction: column;
}

.option-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 8px;
  padding: 16px 24px;
  gap: 0px;
  border-radius: 112px;
  border: 1px solid #d9d9d9;
}

.option-row input {
  flex-grow: 1;
  margin-right: 8px; /* Thêm margin để tạo khoảng cách giữa input và nút x */
}

.remove-button {
  background: none;
  border: none;
  color: #ff4081;
  cursor: pointer;
  margin-left: auto; /* Đưa nút x về phía lề phải */
}

.add-option-button {
  background: none;
  border: none;
  color: #bdbdbd;
  cursor: pointer;
  text-align: center;
}

.footer-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #bdbdbd;
  position: relative; /* Đặt vị trí là relative */
  width: 100%; /* Đảm bảo chiều rộng là 100% */
  height: 64px; /* Thiết lập chiều cao mặc định */
}

.footer-upload-button {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  border: 1px solid #ecf1f4;

  padding: 10px 24px 10px 16px;
  gap: 8px;
  border-radius: 12px;
  border: 1px 0px 0px 0px;
  opacity: 0px;
  position: absolute; /* Đặt vị trí là absolute */
}

.uploaded-image {
  position: absolute;
}

.next-button {
  width: 196px;
  height: 56px;
  background-color: #e13a4b;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 112px;
  gap: 10px;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 24px;
}

.error-message {
  text-align: center;
  align-items: center;
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

.input-container .error-message {
  text-align: left; /* Để căn trái nếu bạn muốn */
  margin-top: 4px;
}

.question-textarea {
  margin-top: 12px;
  font-family: "Noto Sans JP";
  font-size: 24px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  color: #e13a4b80;
  justify-content: center;
  width: fit-content;
}

.option-error-message {
  color: red;
  font-size: 14px;
  margin-left: 16px;
  margin-bottom: 8px;
  text-align: center;

  /* Định dạng vị trí của thông báo lỗi */
  .below-upload-button {
    position: absolute;
    top: 100%; /* Đặt top là 100% so với phần tử cha */
    left: 50%; /* Đặt left là 50% so với phần tử cha */
    transform: translateX(-50%); /* Dịch chuyển vị trí sang trái 50% để căn giữa */
  }
}

/* Tối ưu hóa layout cho màn hình có độ rộng nhỏ hơn */
@media screen and (max-width: 768px) {
  .container {
    width: 100%; /* Chiều rộng tối đa cho container là 100% */
  }

  .add-image {
    height: 120px; /* Giảm chiều cao của phần add image */
  }

  .floor-display input {
    width: 70px; /* Giảm độ rộng của input cho số tầng */
  }

  .question-heading {
    margin-left: 8px;
    margin-right: 8px; /* Giảm khoảng cách giữa lề trái và lề phải của phần question heading */
  }

  .question-label {
    max-width: 50px; /* Giảm kích thước của question label */
    font-size: 12px; /* Giảm kích thước font cho question label */
    padding: 6px 8px; /* Giảm khoảng cách giữa text và viền */
  }

  .option-row {
    padding: 8px; /* Giảm khoảng cách giữa các option row */
  }

  .next-button {
    width: 150px; /* Giảm kích thước của nút next */
    height: 40px; /* Giảm kích thước của nút next */
    font-size: 14px; /* Giảm kích thước font cho nút next */
  }

  .footer-upload-button {
    padding: 8px 16px; /* Giảm khoảng cách giữa nút upload footer */
    font-size: 12px; /* Giảm kích thước font cho nút upload footer */
  }
}

/* Tối ưu hóa layout cho màn hình có độ rộng nhỏ hơn */
@media screen and (max-width: 480px) {
  .add-image {
    height: 100px; /* Giảm chiều cao của phần add image */
  }

  .floor-display input {
    width: 50px; /* Giảm độ rộng của input cho số tầng */
  }

  .question-heading {
    margin-left: 4px;
    margin-right: 4px; /* Giảm khoảng cách giữa lề trái và lề phải của phần question heading */
  }

  .question-label {
    max-width: 40px; /* Giảm kích thước của question label */
    font-size: 10px; /* Giảm kích thước font cho question label */
    padding: 4px 6px; /* Giảm khoảng cách giữa text và viền */
  }

  .option-row {
    padding: 4px; /* Giảm khoảng cách giữa các option row */
  }

  .next-button {
    width: 120px; /* Giảm kích thước của nút next */
    height: 36px; /* Giảm kích thước của nút next */
    font-size: 12px; /* Giảm kích thước font cho nút next */
  }

  .footer-upload-button {
    padding: 6px 12px; /* Giảm khoảng cách giữa nút upload footer */
    font-size: 10px; /* Giảm kích thước font cho nút upload footer */
  }
}
</style>
