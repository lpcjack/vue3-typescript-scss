import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const elementApp = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    elementApp.component(key, component)
}
elementApp.use(pinia)
elementApp.use(router)
elementApp.mount('#app')