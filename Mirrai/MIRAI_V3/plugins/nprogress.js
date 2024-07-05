// plugins/nprogress.js
import NProgress from 'nprogress'
import './nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    NProgress.start()
  })

  nuxtApp.hook('page:finish', () => {
    NProgress.done()
  })

  nuxtApp.hook('app:error', () => {
    NProgress.done()
  })
})
