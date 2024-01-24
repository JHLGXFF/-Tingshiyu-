// 跨组件共享数据的存储对象
import { defineStore } from 'pinia'//引入 Pinia 的 defineStore 方法:

// 创建名为 "admin" 的 store，存储和操作与管理员相关的状态
export const AdminStore = defineStore("admin", {//export，这个 store 可以在其他文件中被引入和使用
    state: () => { // 定义store的初始状态
        return {
            id: 0, // id初始值为0
            account: "", // account初始值为空字符串
            token: "" // token初始值为空字符串
        }
    },
    actions: {}, // 定义store的actions（操作方法）
    getters: {} // 定义store的getters（计算属性）
})
/*
持久性: adminStore 通常只在应用运行时存在，而 localStorage 提供跨会话的持久性存储。
使用场景: adminStore 适用于存储和管理当前会话中需要的状态信息。localStorage 适用于存储需要跨会话保留的数据，如用户偏好设置或在多个会话中重用的认证信息。
访问方式: adminStore 的数据通常在应用内部使用，而 localStorage 的数据可以被浏览器的任何页面（在同一域下）访问。
*/