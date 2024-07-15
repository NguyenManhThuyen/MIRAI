import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'bottom-right',
    toastOptions: {
      success: {
        style: {
          background: 'blue', // Thay đổi màu nền thành xanh dương
        },
      },
    },
  });

  return {
    provide: { toast },
  };
});

