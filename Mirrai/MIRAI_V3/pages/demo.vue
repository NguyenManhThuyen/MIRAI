<template>
    <div>
      <button @click="notifyDefault">Default</button>
      <button @click="notifyInfo">Info</button>
      <button @click="notifySuccess">Success</button>
      <button @click="notifyWarning">Warning</button>
      <button @click="notifyError">Error</button>
      <button @click="notifyDark">Dark</button>
    </div>
  </template>
  
  <script setup>
  import { toast } from 'vue3-toastify';
  
  const notifyDefault = () => {
    toast("This is a default notification");
  };
  
  const notifyInfo = () => {
    toast.info("This is an info notification");
  };
  
  const notifySuccess = () => {
    toast.success("This is a success notification");
  };
  
  const notifyWarning = () => {
    toast.warning("This is a warning notification");
  };
  
  const notifyError = () => {
    toast.error("This is an error notification");
  };
  
  const notifyDark = () => {
    toast.dark("This is a dark notification");
  };
  </script>
  