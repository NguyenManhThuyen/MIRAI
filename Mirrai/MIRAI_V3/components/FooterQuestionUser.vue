<template>
  <footer class="footer">
    <!-- Chỉ hiển thị phần tử .terms nếu hideTerms là false -->
    <div v-if="!hideTerms" class="terms">
      <NuxtLink 
        v-if="!disableLink" 
        :to="linkUrl"
        class="active-link"
      >
        <p>{{ linkText }}</p>
      </NuxtLink>
      <p 
        v-else 
        class="disabled-link"
      >
        {{ linkText }}
      </p>
    </div>
    <div class="copyright">
      <p class="company">中部電力 MIRAI TOWER</p>
      <p class="notice">© 2020 Nagoya TV Tower Corporation.</p>
    </div>
  </footer>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the props
const props = defineProps({
  disableLink: {
    type: Boolean,
    default: false
  },
  linkUrl: {
    type: String,
    default: '/users/questionRules'
  },
  linkText: {
    type: String,
    default: '利用規約と条件'
  },
  hideTerms: { 
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.footer {
  text-align: center;
}

.terms {
  background-color: #F1F4F9; /* Light grey background */
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-link p {
  text-decoration: underline;
  margin-bottom: 1px;
  color: #4B4B4D;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
}

.disabled-link {
  color: #4B4B4D; /* Maintain the same color when disabled */
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none; /* Remove underline for disabled state */
}

.copyright {
  background-color: #0082CA; /* Blue background */
  color: white;
  height: 105px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.company {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  margin-bottom: 16px;
}

.notice {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0;
}
</style>
