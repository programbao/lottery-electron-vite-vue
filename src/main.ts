import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import ElementPlus from 'element-plus' // 添加此行
import 'element-plus/theme-chalk/index.css'  // 添加此行
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
const app = createApp(App);
const state = createPinia();
const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  // draggable: true,
  // draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

app.use(Toast, options);
app.use(state);
app.use(ElementPlus) // 添加此行
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
