<!-- 登录界面 -->
<template>
    <div class="outer-container">
    <!--容器-->
        <div class="login-panel">
            <n-card title="随享平台登录">
                <!--创建表单，账号和密码输入-->
                <n-form :rules="rules" :model="admin">
                    <n-form-item path="account" label="账号">
                        <n-input v-model:value="admin.account" placeholder="请输入账号" /> <!-- 输入框 -->
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                    </n-form-item>
                </n-form>

                <!--复选框 -->
                <template #footer>
                    <n-checkbox v-model:checked="admin.rember" label="记住我" />
                    <n-button @click="login">登录</n-button><!--登录按钮 -->
                </template>
            </n-card>
        </div>
    </div>
</template>
<script setup>

import { reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'//引入自己写的模块，导入状态管理功能，这通常用于在应用的不同部分之间共享和管理状态。
import { useRouter } from 'vue-router'//导入函数，用于在组件中获取路由信息和操作路由。

//const 是 JavaScript 中的一个关键字，用于声明一个块作用域的常量
const router = useRouter()//获取当前的路由实例router，允许组件进行页面跳转等路由操作
const message = inject("message")//inject函数将message实例注入到组件中
const axios = inject("axios")//axios实例被注入到组件中，通常用于发送HTTP请求到后端。
const adminStore = AdminStore()//实例化，管理管理员相关状态

/**登录验证表单规则 */
let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
};

//用reactive 定义一个响应式admin对象，存储登录表单的数据。
//再次访问登录页面时，从本地存储中检索保存的登录信息，并自动填充到登录表单中。
//从本地存储中取数据
const admin = reactive({
    account: localStorage.getItem("account") || "",  //从浏览器的localStorage中读取"account"项的值，读不到则""
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1 || false
})


const login = async () => {
    //向数据库请求账户密码，服务器的响应将被存在result
    let result = await axios.post("/admin/login", { //异步，借助axios发送POST请求到服务器端/admin/login，验证是否匹配，相应存储在result里
        //admin.account是输入的账号。赋值给account，account传回后端
        account: admin.account,
        password: admin.password
    });
    if (result.data.code == 200) {//登录成功后，后端返回的值存在adminStore
        adminStore.token = result.data.data.token//后端传回的数据提取token
        adminStore.account = result.data.data.account
        adminStore.id = result.data.data.id

        //勾选“记住我”，且登录成功--setItem函数将输入的账号信息、密码和记住我状态存储在本地存储localStorage
        if (admin.rember) {
            localStorage.setItem("account", admin.account)//输入的数据存起来
            localStorage.setItem("password", admin.password)
            localStorage.setItem("rember", admin.rember ? 1 : 0)//true为1，false为0
        }
        router.push("/homePage")//根据路由，跳转页面
        message.info("登录成功")
    } else {
        message.error("登录失败")
    }
}
</script>

<style lang="scss" scoped>
.outer-container {
    min-height: 100vh; /* 确保外部容器覆盖整个视口高度 */
    display: flex; /* 使用Flexbox布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    background: linear-gradient(to bottom, #e6d9ea, #bfcfe7); 
}

.login-panel {
    width: 500px;
    margin-top: -250px;//往上靠一点
    font-weight: bold;
    font-size: large;
    border-radius: 10px;
}

//深度选择器,::v-deep .n-card-header 用于选择 n-card 组件内部的标题部分
::v-deep .n-card-header {
    text-align: center;
    font-size: 24px;  // 字体大小
    font-weight: bold;  // 字体加粗
    color: #4A4A4A;  // 字体颜色
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);  // 文字阴影
    letter-spacing: 0.05em;  // 字间距
    border-radius: 10px;  // 圆角
}
</style>