<!-- 分类页面 -->
<template>
    <h1>分类管理</h1> 
    <div class="container"> <!-- 应用容器样式 -->
        <n-button @click="back">返回</n-button>
        <n-button @click="showAddModel = true">添加</n-button>
        
        <!-- 应用表格样式 -->
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList" :key="category.id">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>
        
        <!-- 添加分类模态框 -->
        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>

        <!-- 修改分类模态框 -->
        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>

import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter} from 'vue-router'
const router = useRouter()

const message = inject("message")//这些都在main.js提供的
const dialog = inject("dialog")
const axios = inject("axios")

const showAddModel = ref(false)//添加框，一开始不出现
const showUpdateModel = ref(false)//修改框，一开始不出现
const categoryList = ref([])//存储从服务器获取的分类列表

const addCategory = reactive({//存储添加表单的数据
    name: ""
})
const updateCategory = reactive({//存储修改表单的数据
    id:0,
    name: ""
})

onMounted(() => {//组件挂载时加载分类数据
    loadDatas()
})

const loadDatas = async () => {//向后端请求数据，获取分类列表
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows//返回列表
}

//添加函数
const add = async () => {//提交到服务端的接口
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) {//如果添加成功
        loadDatas()
        message.info(res.data.msg)//显示添加成功
    } else {
        message.error(res.data.msg)//弹出失败信息
    }
    showAddModel.value = false;//隐藏起来
}

//准备修改分类，填充表单数据
const toUpdate = async (category) =>{
    showUpdateModel.value = true //修改框弹出
    updateCategory.id = category.id
    updateCategory.name = category.name
}

//提交修改后的分类数据，真正的给服务端提交数据
const update = async ()=>{     //点击确认后
    let res = await axios.put("/category/_token/update", { id:updateCategory.id, name: updateCategory.name })
    if (res.data.code == 200) {//判断是否成功
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;//隐藏
}

//删除分类函数
const deleteCategory = async (category) => {
    dialog.warning({
        title: '警告',//对于删除的询问
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {//确认删除
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            if (res.data.code == 200) {//删除成功
                loadDatas()//重新读一遍数据，以求更新
                message.info(res.data.msg)
            } else {//删除失败
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
.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: white;  // 添加背景色
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);  // 添加阴影效果
    border-radius: 8px;  // 圆角边框
}

// 标题样式
h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}
// 表格样式
.n-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 12px 15px;
        text-align: center; // 将文本对齐方式设置为居中
        border-bottom: 1px solid #eee;
    }

    thead {
        background-color: #f5f5f5;
    }

    tr:nth-child(even) {
        background-color: #fafafa;
    }

    // 操作列样式
    td:last-child { // 选中每行中的最后一个单元格（通常是操作列）
        display: flex;
        justify-content: center; // 居中对齐按钮
        align-items: center;
    }
}

// 按钮样式
.n-button {
    margin: 10px;
    border-radius: 4px;  // 圆角按钮
}

// 模态框样式
.n-modal {
    .n-modal__content {
        width: 500px;
        padding: 25px;
        border-radius: 8px;  // 圆角模态框
    }
}

// 输入框样式
.n-input {
    width: 100%;
    margin-top: 15px;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;  // 圆角输入框
}

// 复选框样式
.n-checkbox {
    margin-top: 20px;
}
</style>