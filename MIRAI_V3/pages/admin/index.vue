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
  
  const alertTitle = ref('Confirm Deletion');
  const alertContent = ref('Are you sure you want to delete this item?');
  const alertActionText = ref('Delete');
  const alertVisible = ref(false);
  
  const showAlert = () => {
    alertVisible.value = true;
  };
  
  const handleCancel = () => {
    alertVisible.value = false;
  };
  
  const handleConfirm = () => {
    // Handle the confirm action here
    alertVisible.value = false;
  };
  </script>
  