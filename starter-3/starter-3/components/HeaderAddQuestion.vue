<template>
  <div class="icon-container" :style="{ width: containerWidth, height: containerHeight }">
    <div class="icon-row">
      <div v-for="(icon, id) in iconImages" :key="id" class="icon-wrapper">
        <nuxt-link :to="getLink(id)" class="icon-link">
          <img :src="icon" :class="{ 'line-icon': id === 1 || id === 3 || id === 5, 'icon': id !== 1 && id !== 3 && id !== 5 }" />
        </nuxt-link>
        <div class="icon-text" :class="{ 'red-text': icon.includes('red') && id <= selectedIndex }">{{ iconTexts[id] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import liveHelpRed from '@/assets/images/live-help-red.svg';
import line_dark from '@/assets/images/line_dark.svg';
import line_red from '@/assets/images/line_red.svg';
import assignmentTurnedInDark from '@/assets/images/assignment-turned-in-dark.svg';
import assignmentTurnedInRed from '@/assets/images/assignment-turned-in-red.svg';
import questionAnswerDark from '@/assets/images/question-answer-dark.svg';
import questionAnswerRed from '@/assets/images/question-answer-red.svg';
import qrCodeDark from '@/assets/images/qr_code_dark.svg';
import qrCodeRed from '@/assets/images/qr_code_red.svg';

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      containerWidth: '819px',
      containerHeight: '90px',
      iconImages: [liveHelpRed, line_dark, assignmentTurnedInDark, line_dark, questionAnswerDark, line_dark, qrCodeDark],
      iconTexts: ['質問', '', '質問に答えて', '', '正解', '', 'QRコード'],
      selectedIndex: this.id,
    };
  },
  created() {
    this.updateIconImages(this.id);
  },
  methods: {
    selectIcon(id) {
      console.log(id);
      this.selectedIndex = id;
      this.updateIconImages(id + 1);
    },
    updateIconImages(newNumber) {
      const redIcons = [liveHelpRed, line_red, assignmentTurnedInRed, line_red, questionAnswerRed, line_red, qrCodeRed];
      const darkIcons = [liveHelpRed, line_dark, assignmentTurnedInDark, line_dark, questionAnswerDark, line_dark, qrCodeDark];
      
      newNumber = Math.max(1, Math.min(7, newNumber));
      
      this.iconImages = [...darkIcons];
      
      for (let i = 0; i < newNumber; i++) {
        this.iconImages.splice(i, 1, redIcons[i]);
      }
      
      for (let i = 0; i < this.iconTexts.length; i++) {
        this.iconTexts.splice(i, 1, this.iconTexts[i] || '');
      }
    },
    getLink(id) {
      if (id === 6) {
        return '/Admin/QRcode'; // Đặt đường dẫn của component khác ở đây
      } else if (id === 0){
        return '/Admin/AddQuestion'; // Nếu không phải icon điều hướng, đặt đường dẫn là #
      }
    }
  }
};

</script>

<style scoped>
.icon-container {
  position: relative;
  background-color: #FFFFFF;
  width: 819px;
  height: 90px;
  border-radius: 16px;
}

.icon-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: auto;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}

.icon {
  margin: auto;
}

.icon-wrapper img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  margin-left: 12px;
}

.icon-container img.line-icon {
  width: 92.66px;
  height: 2px;
  margin-top: 4px; /* Dịch chuyển lên trên để căn giữa */
  margin-bottom: 4px; /* Dịch chuyển xuống dưới để căn giữa */
}

.icon-text {
  font-size: 14px;
  text-align: center;
}

.red-text {
  color: red;
}

@media (max-width: 1024px) {
  .icon-container {
    width: 600px; /* Adjusted width for smaller screens */
  }
}

@media (max-width: 768px) {
  .icon-container {
    width: 400px; /* Adjusted width for even smaller screens */
  }
}

@media (max-width: 480px) {
  .icon-wrapper img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
    margin-left: 6px;
  }
}
</style>
