<template>
  <div>
    <button @click="showAlert">Show Alert</button>
    <AlertComponent
      :title="alertTitle"
      :content="alertContent"
      :actionText="alertActionText"
      :visible="alertVisible"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NProgress from 'nprogress';
// Optionally, import a custom CSS file if you want to customize the progress bar
// import '@/assets/css/nprogress-custom.css';

const alertTitle = ref('Confirm Deletion');
const alertContent = ref('Are you sure you want to delete this item?');
const alertActionText = ref('Scucce');
const alertVisible = ref(false);

const showAlert = () => {
  NProgress.start();
  NProgress.set(0.4) 
  
  setTimeout(() => {
    alertVisible.value = true;
    NProgress.inc();
    NProgress.done();
  }, 1000); // Simulate a 2-second delay before showing the alert
};

const handleCancel = () => {
  alertVisible.value = false;
  console.log("Cancelled");
};

const handleConfirm = () => {
  // Handle the confirm action here
  alertVisible.value = false;
  console.log("Confirmed");
};
</script>

<style>
/* Add any custom styles if needed */
</style>
