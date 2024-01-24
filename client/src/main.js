//全局应用提供者---用于启动和配置一个完整的Vue应用，包括UI组件、路由、状态管理和 HTTP 请求处理

import { createApp } from 'vue'
import './style.css'//样式文件
import App from './App.vue'//引入根组件App.vue
import naive from 'naive-ui'//按需引入naive框架
import axios from 'axios'//引入框架
import { createDiscreteApi } from 'naive-ui'
import { createPinia } from "pinia";//引入pinia
import { router } from './common/router' //引入本地路由
import { AdminStore } from './stores/AdminStore'//引入本地状态仓库

// 服务端地址，全局的地址单独写，方便更改
axios.defaults.baseURL = "http://localhost:8080"

// 从naive-ui引入独立API，
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])
const app = createApp(App)//创建根组件App.vue,是整个Vue应用的入口点

//provide 实例化和提供一些全局提供可用的属性，以便在整个应用的其他组件中通过 inject 方法来获取和使用这些属性
app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL )//提供服务端的地址，inject获取

//应用插件和路由，使用 app.use 方法安装
app.use(naive)
app.use(createPinia());//状态管理库
app.use(router);

const adminStore = AdminStore()

//配置 Axios 拦截器，为每个发出的请求的headers部分添加Token
axios.interceptors.request.use((config)=>{
    config.headers.token = adminStore.token//给headers加token,每一个请求都带一个token
    return config
})

app.mount('#app')
