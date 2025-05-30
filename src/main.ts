import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@popperjs/core'
import router from './router'
import Toast, { TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
  toastDefaults: {
    [TYPE.ERROR]: {
      timeout: 10000,
      closeButton: false,
    },
    [TYPE.WARNING]: {
      timeout: 3000,
      closeButton: true,
    },
    [TYPE.SUCCESS]: {
      timeout: 3000,
      closeButton: true,
    },
  },
}

const app = createApp(App)
app.use(Toast, options)
app.use(router)
app.mount('#app')
