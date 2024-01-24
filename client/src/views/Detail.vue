<template>
    <div class="container">

        <n-button @click="back">返回</n-button>

        <!-- 标题 -->
        <n-h1>{{ blogInfo.title }}</n-h1>
        <!-- 文章内容 -->
        <div class="blog-content">
            <div v-html="blogInfo.content"></div>
        </div>

    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const blogInfo = ref({})
const axios = inject("axios")

//生命周期钩子，组件加载时初始化数据
onMounted(() => {
    loadBlog()
})

//读取文章详情
const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id)
    blogInfo.value = res.data.rows[0];//将res的数据部分赋值给blogInfo.value（包含title、content）两部分
}

const back = ()=>{
    router.push("/homepage")
}

</script>

<style>
.blog-content img {
    max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>