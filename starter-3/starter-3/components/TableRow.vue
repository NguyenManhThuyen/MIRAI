<script setup>
defineProps({
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  faculty: {
    type: String,
    default: '',
  },
  year: {
    type: Number,
    default: 1,
  },
})
</script>

<template>
  <tr>
    <td class="border-b border-slate-500 font-medium p-4 pt-0 pb-3 text-slate-600 text-left">
      {{ firstName }}
    </td>
    <td class="border-b border-slate-500 font-medium p-4 pt-0 pb-3 text-slate-600 text-left">
      {{ lastName }}
    </td>
    <td class="border-b border-slate-500 font-medium p-4 pt-0 pb-3 text-slate-600 text-left">
      {{ location }}
    </td>
    <td class="border-b border-slate-500 font-medium p-4 pt-0 pb-3 text-slate-600 text-left">
      {{ faculty }}
    </td>
    <td class="border-b border-slate-500 font-medium p-4 pt-0 pb-3 text-slate-600 text-left">
      {{ year }}
    </td>
  </tr>
</template>
