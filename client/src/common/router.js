//引入相关函数，路由配置都放这里
import { createRouter, createWebHashHistory } from "vue-router";

// 定义路由配置数组
let routes = [ //懒加载，需要时才加载。   component: 要渲染的Vue组件
{ path: "/", component: () => import("../views/Login.vue") },
{ path: "/homepage", component: () => import("../views/HomePage.vue") },
{ path: "/detail", component: () => import("../views/Detail.vue") }, 
{ path: "/login", component: () => import("../views/Login.vue") }, 
{ path: "/Chat", component: () => import("../views/Chat.vue") },
{ path: "/Note", component: () => import("../views/Note.vue") },
{ path: "/category", component: () => import("../views/Category.vue") },
{ path: "/article", component: () => import("../views/article.vue") },
]

// 创建路由实例
const router = createRouter({
history: createWebHashHistory(), //使用hash模式处理URL，会在URL路径前加上 # 符号
routes, // 路由配置数组
});

// 导出路由实例和路由配置数组
 export { router, routes };