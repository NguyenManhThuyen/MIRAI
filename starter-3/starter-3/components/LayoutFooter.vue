<script setup>
import { computed } from 'vue'

const currentYear = computed(() => {
    let today = new Date()
    let year = today.getFullYear()
    return year
})
</script>

<template>
  <div class="px-4 py-9 bg-zinc-700">
    <div class="container mx-auto">
      <p class="text-center text-zinc-100">
        Copyright © {{ currentYear }} <span class="font-bold text-teal-700">Nikki</span>. All Rights Reserved.
      </p>
    </div>
  </div>
</template>
