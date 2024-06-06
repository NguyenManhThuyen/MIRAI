<script setup>
defineProps({
  backgroundTitle: {
    type: String,
    default: '',
  },
  foregroundTitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="relative py-20">
    <div class="relative flex items-center justify-center w-full">
      <div class="absolute flex items-center justify-center">
        <span class="text-4xl font-bold tracking-widest text-gray-200 uppercase md:text-5xl lg:text-6xl opacity-70">
          {{ backgroundTitle }}
        </span>
        <span class="absolute bottom-0 w-24 h-1 bg-teal-700 rounded-full" />
      </div>
      <div class="text-2xl font-extrabold lg:text-3xl text-zinc-800">
        {{ foregroundTitle }}
      </div>
    </div>
  </div>
</template>
