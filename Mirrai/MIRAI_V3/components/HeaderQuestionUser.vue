<template>
  <header class="header">
    <div class="icon-container">
      <img src="@/assets/images/mirai-icon.svg" class="header-icon" />
    </div>
    <div :class="['header-text', { 'no-subtitle': !subtitle }]">
      <p class="main-text">スカイウォーキング・デジタルクイズチャレンジ</p>
    </div>
    <div class="sub-text" v-if="subtitle">
      <p>{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const subtitle = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-infos-lambda/1');
    subtitle.value = response.data.content;
  } catch (error) {
    console.error('Error fetching subtitle:', error);
    // Handle error or set default subtitle
    subtitle.value = '';
  }
});

const hasSubtitle = computed(() => !!subtitle.value);
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
  display: inline-block;
  padding-top: 8px;
  padding-bottom: 11px;
  border-bottom: 1px solid #CDCDCD;
}

.no-subtitle .main-text {
  border-bottom: none;
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
