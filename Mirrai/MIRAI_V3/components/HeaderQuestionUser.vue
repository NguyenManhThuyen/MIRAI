<template>
  <header class="header">
    <div class="icon-container">
      <img src="@/assets/images/mirai-icon.svg" class="header-icon" />
    </div>
    <div class="header-text">
      <p class="main-text">スカイウォーキング・デジタルクイズチャレンジ</p>
    </div>
    <div class="sub-text">
      <p>{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const subtitle = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/1');
    subtitle.value = response.data.content;
  } catch (error) {
    console.error('Error fetching subtitle:', error);
    // Handle error or set default subtitle
    subtitle.value = 'Default subtitle';
  }
});
</script>

<style scoped>
.header {
  text-align: center;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
  margin-top: 8px;
}

.header-icon {
  width: 26px;
  height: 25px;
}

.header-text {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #4B4B4D;
}

.main-text {
  border-bottom: 1px solid #CDCDCD;
  display: inline-block;
  padding-top: 8px;
  padding-bottom: 11px;
}

.sub-text {
  margin-top: 11px;
  margin-bottom: 8px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #0082CA; /* Blue color */
}
</style>
