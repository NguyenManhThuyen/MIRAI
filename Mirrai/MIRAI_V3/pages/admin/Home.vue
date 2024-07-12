<template>
  <HeaderAdminHome />
  <div class="admin-home">
    <div class="spacer"></div>
    <div class="content">
      <div class="tabs">
        <div class="tab" @click="selectedTab = 'question'" :class="{ 'active-tab': selectedTab === 'question' }">
          <img v-if="selectedTab === 'question'" src="@/assets/images/admin-home-question-icon-white.svg" class="tab-icon1" />
          <img v-else src="@/assets/images/admin-home-question-icon-black.svg" class="tab-icon" />
          質問
        </div>
        <div class="tab" @click="selectedTab = 'analysis'" :class="{ 'active-tab': selectedTab === 'analysis' }">
          <img v-if="selectedTab === 'analysis'" src="@/assets/images/admin-home-chart-icon-white.svg" class="tab-icon2" />
          <img v-else src="@/assets/images/admin-home-chart-icon-black.svg" class="tab-icon" />
          分析
        </div>
        <div class="tab" @click="selectedTab = 'setting'" :class="{ 'active-tab': selectedTab === 'setting' }">
          <img v-if="selectedTab === 'setting'" src="@/assets/images/admin-home-setting-icon-white.svg" class="tab-icon2" />
          <img v-else src="@/assets/images/admin-home-setting-icon-black.svg" class="tab-icon" />
          設定
        </div>
      </div>

      <BodyAdminHome v-show="selectedTab === 'question'" />
      <BodyAdminAnalysis v-show="selectedTab === 'analysis'" />
      <BodyAdminSetting v-show="selectedTab === 'setting'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const selectedTab = ref('question')
const router = useRouter()

onMounted(() => {
  const email = sessionStorage.getItem('email')
  if (!email) {
    router.push('/admin/login')
  }
})

useHead({
        title: 'Home | MIRAI',
    });
</script>
  
<style scoped>
.admin-home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spacer {
  height: 16px;
  background-color: #F1F4F9; /* Light grey background */
  width: 100%;
}

.content {
  width: 100%;
  padding: 16px;
}

.tabs {
  display: flex;
  justify-content: flex-start; /* Canh lề trái */
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E3E4EC
}

.tab {
  display: flex;
  align-items: center;

  width: 90px;
  height: 48px;
  padding: 12px;
  gap: 10px;
  border-radius: 8px 8px 0px 0px;


  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  color: #000000; /* Blue color */
}

.tab-icon1 {
  width: 20px;
  height: 20px;
}

.tab-icon2 {
  width: 24px;
  height: 24px;
}

.active-tab {
  background-color: #2E7CF6; /* Màu nền khi tab được chọn */
  color: white; /* Màu chữ khi tab được chọn */
}
</style>
