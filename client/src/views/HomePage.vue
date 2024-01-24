<template>
    <div class="container">
        <!-- 左边的导航栏 -->
        <div class="navLeft">
            <div>首页天地</div>
             <!--弹出选择器-->
            <div>      <!--监听选择器，选择选项后调用searchByCategory方法-->
                <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categortyOptions" trigger="click">
                   <!-- 定义弹出选择器的显示内容 -->
                    <div>语种分类<span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="toChat">好友聊天</div>
            <div @click="toNote">随想随记</div>
            <div @click="ToArticle">文章管理</div>
            <div @click="ToCategory">分类管理</div>
        </div>

        <!-- 右边的导航栏 -->
        <div class="navRight">
            <div @click="ToLogin">退出</div>
        </div>

        <!-- 搜索框 -->
        <n-divider /> <!-- 水平分隔线：空一行 -->
        <n-space class="search">
             <!-- v-model:value="pageInfo.keyword双向绑定法，将输入框的值绑定到实例的 pageInfo.keyword 数据 -->
            <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字" />
            <n-button class="search-button"  @click="loadBlogs(0)"> 搜索 </n-button>
        </n-space>
        
       <!-- 展示数据 -->
       <div v-for="(blog) in blogListInfo" class="blog-item" style="margin-bottom:15px;cursor: pointer;">
            <!-- 此处 n-card 组件将应用 .n-card 的样式 -->
            <n-card :title="blog.title" class="n-card" @click="toDetail(blog)">
                <div v-html="blog.content"></div>
                <template #footer>
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        
        <!-- 底部页码计数器    事件监听器，监听page值的更新事件--变化时调用loadBlogs方法 -->
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
                                               <!--双向绑定，同步组件当前页面page与父组件pageInfo.page-->
        <!--水平分割线：空一行 -->
        <n-divider />
         <!-- 最底部标识 -->
        <div class="footer">
            <div>Power By 随享</div>
            <div>联通世界，走向未来</div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter} from 'vue-router'
const router = useRouter()//实例化对象
const axios = inject("axios")//在组件中引入全局可用变量


//ref函数创建的响应式引用，追踪数据的响应式变化，同时用于存储数据。
const selectedCategory = ref(0)//选中的分类，初始值0
const categortyOptions = ref([])//可选的分类选项
const blogListInfo = ref([])//文章列表

// 响应式对象，存放与 查询和分页相关的数据
//当这些对象的属性发生变化时，任何依赖于这些属性的 Vue 组件都会自动更新
const pageInfo = reactive({
    page: 1,//当前页码
    pageSize: 3,//每页放几个栏目
    pageCount: 0,//总页数
    count: 0,//总条目数
    keyword: "",//用于搜索或过滤的关键词
    categoryId:0,//分类ID
})

//生命周期钩子，组件加载时初始化数据
onMounted(() => {
    loadCategorys();
    loadBlogs()
})

//从后端获取博客列表
const loadBlogs = async (page = 0) => {//async异步函数
    //为0，则从第一页开始加载数据。
    //不为0，有特定的页码要求
    if (page != 0) {
        pageInfo.page = page;
    }
    //等待并获取服务器响应的结果res
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
    let temp_rows = res.data.data.rows;
    // 处理获取的文章列表数据
    for (let row of temp_rows) {
        row.content += "..."
        // 把时间戳转换为年月日
        let d = new Date(row.create_time)//创建Date对象d
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    //计算需要分页的数目           总数据/每页数据                             //剩下的不够1页的也要算上
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
    console.log(res)//打印
}

//根据当前选中的分类 ID 获取相应的分类名
const categoryName = computed(() => {//创建一个计算属性，其值基于其他响应式数据的变化而动态变化。
    //获取选中的分类                                                       value--id  label --名
    let selectedOption = categortyOptions.value.find((option) => { return option.value == selectedCategory.value })
    //返回分类的名称
    return selectedOption ? selectedOption.label : ""//找到匹配选项，返回分类名称
})

//从后端获取分类列表
const loadCategorys = async () => {
    let res = await axios.get("/category/list")//使用 axios 发起一个 GET 请求到 /category/list 路径
    categortyOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,//名
            value: item.id
        }
    })
    console.log(categortyOptions.value)
}

//选中分类，跟踪用户选择的分类。
const searchByCategory = (categoryId)=>{
    pageInfo.categoryId = categoryId ;//pageInfo响应式对象，
    loadBlogs()//根据当前pageInfo（里面的分类ID）刷新博客列表
}

//页面跳转
const toDetail = (blog)=>{
    router.push({path:"/detail",query:{id:blog.id}})
}

const ToArticle= () => {
    router.push("/article")
}

const ToCategory= () => {
    router.push("/category")
}

const toChat = () => {
    router.push("/Chat")
}

const toNote = () => {
    router.push("/Note")
}

const ToLogin= () => {
    router.push("/")
}
</script>

<style lang="scss" scoped>
.search{
    margin-bottom: 15px;//元素下方的外边距为 15 像素
}
.container {
    width: 1200px;
    margin: 0 auto;
}

.navLeft {
    display: flex;
    font-size: 25px;//字体大小
    padding-top: 20px;//上边填充为 20 像素
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 30px;
        

        &:hover {//悬浮时显示的颜色
            color: rgb(10, 126, 53);
        }

        span {
            font-size: 12px;
            //  letter-spacing: normal;
        }
    }
}

//右边的导航栏
.navRight {
    display: flex;
    font-size: 25px;
    padding-top: 20px;//上边填充为 20 像素。
    padding-right: 20px;//右边边填充为 20 像素。
    color: #64676a;
    position: absolute;
    top: 0;//将元素定位在容器的右上角。
    right:0;
    cursor: pointer;
}

//网页底部（页脚）
.footer {
    text-align: center;//文字居中对齐
    line-height: 25px;//行高为 25 像素
    color: rgb(118, 114, 112);//文字颜色
}

//文章缩略卡片
.n-card {
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