<template>
 <div class="container"> <!-- 应用容器样式 -->
    <n-button @click="back">返回</n-button>
    <h1 class="header">文章管理</h1> <!-- 标题样式已应用 -->
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        
        <!--文章列表-->
        <n-tab-pane name="list" tab="文章列表">
                <div v-for="(blog) in blogListInfo" class="blog-item">
                    <n-card :title="blog.title" class="n-card-m">
                        <!-- 内容卡片 -->
                        <div v-html="blog.content"></div><!-- 博客内容，优于{{ blog.content }}-->
                            <n-space align="center">
                                <div>发布时间：{{ blog.create_time }}</div>
                                <n-button @click="toDelete(blog)">删除</n-button>
                            </n-space>
                    </n-card>
                </div>
            <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" class="pagination" />
        </n-tab-pane>
        
        <!--添加文章-->
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">   <!--双向绑定-->
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">                   <!--选择器选项来自categortyOptions数据属性-->
                    <n-select v-model:value="addArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <!-- 引入自定义的富文本组件组件，编辑器的内容双向绑定 -->
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>

    </n-tabs>
  </div>
</template>

<script setup>
//引入和初始化

import { ref, reactive, inject, onMounted } from 'vue'
import RichTextEditor from '../components/RichTextEditor.vue'//引入自己写的富文本组件
import { useRouter } from 'vue-router'
const router = useRouter()
const message = inject("message")//从main.js中获取依赖
const axios = inject("axios")
const dialog = inject("dialog")

//响应式对象
//reactive 函数定义响应式对象数据：当这些对象的属性发生变化时，任何依赖于这些属性的 Vue 组件都会自动更新
//存储添加文章时的数据
const addArticle = reactive({
    categoryId: "中文",
    title: "",
    content: "",
})

//存储和管理与分页相关的数据
const pageInfo = reactive({
    page: 1,//用户当前查看的是第一页
    pageSize: 3,//每页显示的项目数
    pageCount: 0,//总页数
    count: 0,// 总数据数量
})

//响应式引用
//使用 ref 创建了可响应式引用，不仅可以用来追踪数据的响应式变化，也同时用于存储数据。
const categortyOptions = ref([])//分类选项
const blogListInfo = ref([])//博客列表信息
const tabValue = ref("list")//当前标签页

//生命周期钩子，初始化页面数据。
//从服务端读取数据，在页面加载时就执行。其他操作在用户执行特定操作（如点击按钮）时触发。
onMounted(() => {
    loadBlogs()//函数
    loadCategorys()//函数
})

//加载博客文章或相关数据
const loadBlogs = async () => {//异步函数
    //发送GET请求到服务器/blog/search 端点
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)//请求页面号、每页显示的文章数量
   //从响应res获取data.data.rows，包含了博客文章的列表
    let temp_rows = res.data.data.rows;
    
    for (let row of temp_rows) {
        row.content += "..."//获取的文章内容加...
        let d = new Date(row.create_time)//获取时间戳
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`//间戳转换为更可读的格式
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;//总文章数。
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)//计算总页数
    console.log(res)
}

//加载文章类别信息
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categortyOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categortyOptions.value)//打印出来查看格式是否正确
}

//提交新文章的数据
const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
}

// 删除指定的文章
const toDelete = async (blog) => {
    dialog.warning({
        title: '警告',//对于删除的询问
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {//确认删除
            let res = await axios.delete("/blog/_token/delete?id="+blog.id)
            if (res.data.code == 200) {
                message.info(res.data.msg)
                loadBlogs()
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }//放弃删除
    })
}

const back = () => {
    router.push('/HomePage')
}
</script>

<style lang="scss" scoped>
// 整体布局
.container {
    width: 80%;
    margin: 20px auto;
}

.header{
    text-align: center
}

// 博客文章列表排列项样式
.blog-item {
    margin-bottom: 30px; // 博客卡片上下的边距
}


.n-card-m {
    border-radius: 10px; // 圆角
    box-shadow: 0 4px 10px rgba(14, 173, 242, 0.1);
    border: 1px solid #eaecef; 
    overflow: hidden; // 防止内容溢出圆角
    transition: box-shadow 0.3s ease; // 平滑阴影过渡效果

    &:hover {
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); // 鼠标悬停时的阴影效果
    }
}
</style>