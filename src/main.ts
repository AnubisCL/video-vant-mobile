import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import 'virtual:uno.css'
import '@/styles/app.less'
import { i18n } from '@/utils/i18n'

// Vant 桌面端适配
import '@vant/touch-emulator'
import { Lazyload } from 'vant';

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

const app = createApp(App)
/**
 * 关联 App.vue 中的 useHead
 * 用于管理和优化 Vue 应用程序中的 HTML <head> 部分。
 * 在 Vue 应用中，<head> 标签包含了诸如标题、元数据、链接、脚本等元素，
 * 这些对于SEO、页面加载性能和浏览器兼容性都是至关重要的。
 */
const head = createHead()

app.use(head) // 挂载head
app.use(router) // 挂载路由
app.use(pinia) // 挂载pinia store
app.use(i18n) // 挂载i18n 国际化
app.use(Lazyload) // 挂载懒加载

app.mount('#app')
