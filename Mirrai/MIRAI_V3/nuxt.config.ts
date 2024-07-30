// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  plugins: [
    '~/plugins/nprogress.js',
    '~/plugins/vue3-toastify.ts'
  ],

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  nitro: {
    compressPublicAssets: true,
    devProxy: {
      host: '192.168.11.199',
      "/**": {
        target: "https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        changeOrigin: true,
        prependPath: true
      }
    }
  },

  modules: ["@stefanobartoletti/nuxt-social-share"],

  compatibilityDate: "2024-07-25",
})