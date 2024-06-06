<template>
  <div>
    <!-- Các phần khác của trang -->
    <MyStepComponent :id="1" /> <!-- Truyền id vào component -->
  </div>
</template>

<script>
import MyStepComponent from '@/components/MyStepComponent.vue';

export default {
  components: {
    MyStepComponent,
  },
  // ...
}
</script>

