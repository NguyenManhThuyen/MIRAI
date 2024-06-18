// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:true,
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  nitro: {
    devProxy: {
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
  routeRules: {
    '/users/**': { proxy: { to: "https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/users/**" } },
    '/': { redirect: '/Admin/Login' },
  },
  modules: ["@stefanobartoletti/nuxt-social-share"],
})