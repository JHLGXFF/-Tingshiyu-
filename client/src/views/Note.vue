<template>
    <div>
      <n-button @click="back">返回</n-button>
      <n-layout>

        <!-- 页面主标题 -->
        <n-layout-header>
          <h1 class="centered-title">随想随记</h1>
        </n-layout-header>
  
        <n-layout has-sider>

          <!-- 左侧主要内容，随记卡片 -->
          <n-layout-content  class="n-layout-content">

             <!-- 卡片列表 -->
            <n-card class="n-card" v-for="item in items" :key="item.id">
              <p>{{ item.content }}</p>
            </n-card>

               <!-- 添加按钮 -->
            <div class="button">
              <n-button @click="addNewItem">添加</n-button>
            </div>
          </n-layout-content>
  
        <!-- 右侧辅助内容,用的是element-plus -->
        <n-layout-sider width="440px">
          <h2 class="centered-title">重要活动</h2>
          <el-table :data="tableData" border>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="eventName" label="活动名称"></el-table-column>
            <el-table-column prop="location" label="地点"></el-table-column>
          </el-table>
          
            <!-- 添加活动按钮 -->
          <div class="add-button">
            <n-button @click="addNewEvent">添加活动</n-button>
          </div>

          <!--日历-->
          <h2 class="centered-title">日程表</h2>
          <el-calendar v-model="value" />

        </n-layout-sider>
      </n-layout>
      </n-layout>
    </div>
  </template>
  
  <script setup>
    import 'element-plus/dist/index.css';
    import { NButton, NLayout, NLayoutHeader, NLayoutContent, NLayoutSider, NCard } from 'naive-ui';
    import { ref,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElTable, ElCalendar,ElTableColumn } from 'element-plus';

    //响应式应用
    const value = ref(new Date())
    const router = useRouter()
    const items = ref([]);//存放左侧卡片内容的数组
    const tableData = ref([//表格现有数据
      { date: '1.8', eventName: '操作系统', location: 'WLA209' },
      { date: '1.10', eventName: '需求工程', location: 'WLA207' },
      { date: '1.11', eventName: '计算机网络', location: 'WLA209' }
    ]);
  
  // 初始化页面内容
  onMounted(() => {
    generateItems() 
  })
  
  //添加左边卡片内容
  function addNewItem() {
  const newItem = {
    id: items.value.length, // 给新项目一个唯一的ID
    content: '新卡片内容' // 新卡片的内容
  };
    items.value.push(newItem);
}

  //初始化左边卡片内容，初始化一个名为 items 的响应式数组
  function generateItems() {
  const contentList = [
    '项目结构和组件设计',
    '状态管理',
    '用户界面和体验',
    '性能优化',
    '路由和导航',
    'API 管理和数据处理',
    '安全性',
    '代码质量和维护'
  ];

  for (let i = 0; i < contentList.length; i++) {
    items.value.push({
      id: i,
      content: contentList[i]
    });
  }
}

// 添加新活动
function addNewEvent() {
  const newEvent = {
    date: '1.12', // 新活动的日期
    eventName: '放寒假', // 新活动的名称
    location: '北京' // 新活动的地点
  };
  tableData.value.push(newEvent);
}
  
  //跳转
  const back = () => {
    router.push('/HomePage')
  }
</script>
  
<style scoped>

.centered-title{
  text-align: center;
}
.button{
  position: absolute;
  bottom: 20px;      /* 距离底部20px */
  right: 20px;  
}

.add-button {
    text-align: right;
    margin-bottom: 20px;
}

.n-layout-content {
    margin-right: 20px; /* 可以根据需要调整这个值 */
    padding-bottom: 70px;
}

.n-card {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(14, 173, 242, 0.1);
    border: 1px solid #eaecef; 
    overflow: hidden; 
    transition: box-shadow 0.3s ease; 
    margin-bottom: 15px;

    &:hover {
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    }
}
</style>
  