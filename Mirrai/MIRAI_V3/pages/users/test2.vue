<template>
    <div></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
  
  onMounted(async () => {
    try {
      const fingerprint = await getCurrentBrowserFingerPrint();
      console.log(fingerprint);
      alert(fingerprint);
    } catch (error) {
      console.error('Failed to get fingerprint:', error);
    }
  });
  </script>
  