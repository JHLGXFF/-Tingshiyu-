//������غ�����·�����ö�������
import { createRouter, createWebHashHistory } from "vue-router";

// ����·����������
let routes = [ //�����أ���Ҫʱ�ż��ء�   component: Ҫ��Ⱦ��Vue���
{ path: "/", component: () => import("../views/Login.vue") },
{ path: "/homepage", component: () => import("../views/HomePage.vue") },
{ path: "/detail", component: () => import("../views/Detail.vue") }, 
{ path: "/login", component: () => import("../views/Login.vue") }, 
{ path: "/Chat", component: () => import("../views/Chat.vue") },
{ path: "/Note", component: () => import("../views/Note.vue") },
{ path: "/category", component: () => import("../views/Category.vue") },
{ path: "/article", component: () => import("../views/article.vue") },
]

// ����·��ʵ��
const router = createRouter({
history: createWebHashHistory(), //ʹ��hashģʽ����URL������URL·��ǰ���� # ����
routes, // ·����������
});

// ����·��ʵ����·����������
 export { router, routes };