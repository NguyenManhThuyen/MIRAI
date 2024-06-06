<template>
    <div>
      <div
        v-for="step in steps"
        :key="step.id"
        :class="{ active: step.id === activeStepId }"
      >
        {{ step.label }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { toRef } from 'vue';
  
  const props = defineProps({
    id: Number, 
  });
  
  const steps = [
    { id: 1, label: 'Store Location' },
    { id: 2, label: 'Confirm Order Info' },
    { id: 3, label: 'Delivery' },
    { id: 4, label: 'QR Code' },
  ];
  
  const activeStepId = toRef(props, 'id');
  </script>
  
  <style scoped>
  .active {
    background-color: red; 
  }
  </style>
  