<template>
    <div class="app-container">
      <!-- 返回按钮 -->
      <div class="back-button">
        <n-button @click="back">返回</n-button>
      </div>
        
      <!-- 用户列表 -->
      <div class="user-list">
        <n-list>
          <n-list-item v-for="user in userList" :key="user.id" @click="selectUser(user)">
            {{ user.name }}
          </n-list-item>
        </n-list>
      </div>
      
      <!-- 聊天窗口和消息输入区 -->
      <div class="chat-container">
        <!-- 聊天内容区 -->
        <div class="chat-window">
            <div class="chat-header">{{ selectedUser.name || '...' }} </div>
          <n-scrollbar wrap-class="chat-messages">
         <!-- 打印消息 -->
                                   <!-- 从筛选过指定用户的filteredMessages读取数据，一条是自己发的，另一条是模拟对方发的 -->          <!--如果发送者是“我”，则应用“mine”样式；如果发送者是其他人，则应用“theirs”样式。-->
            <div v-for="message in filteredMessages" :key="message.id" class="message" :class="{ 'mine': message.sender === '我', 'theirs': message.sender !== '我' }">
                 <!-- 消息具体内容 -->
                 <div class="message-content">{{ message.content }}</div>
                 
                 <!-- 消息发送者名字和时间 -->
                 <div class="message-info">
                    <span class="message-sender">{{ message.sender }}</span> <!-- 发送方 -->
                    <span class="message-timestamp">{{ message.timestamp }}</span> <!-- 回复方 -->
                 </div>
         
            </div>
           </n-scrollbar>
        </div>
  
        <!-- 消息输入区 -->
        <div class="message-input"><!--双向绑定，输入框的值绑定到组件的newMessage-->
          <n-input v-model:value="newMessage" placeholder="请输入消息..."/>
          <n-button @click="sendMessage">发送</n-button>
        </div>

      </div>
    </div>
  </template>
  
<script setup>
import { ref, computed } from 'vue'
import { NInput, NButton, NList, NListItem, NScrollbar } from 'naive-ui'
import { useRouter} from 'vue-router'//导入函数，用于在组件中获取路由信息和操作路由。
const router = useRouter()//获取当前的路由实例，允许组件进行页面跳转等路由操作
const userList = [
  { id: 1, name: '林一' },
  { id: 2, name: '鹿二' },
  { id: 3, name: '张三' },
  { id: 4, name: '李四' },
  { id: 5, name: '王五' },
  { id: 6, name: '赵六' },
  { id: 7, name: '郭七' },
  // 更多用户...
]

//响应式应用--变量的值变化时，相关的界面将自动更新以反映新的状态。
const selectedUser = ref(userList[0])//用户对象的数组
const messages = ref([])//存储聊天消息
const newMessage = ref('')//收集用户输入的新消息

const sendMessage = () => {
  if (newMessage.value.trim()) {//检查输入消息为空？ trim()去字符串两端空白字符
    const now = new Date();//创建一个Date对象
    const timestamp = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');//小时:分钟   padStart(2, '0')分钟始终是两位数
    const messageContent = newMessage.value; //临时变量，保存新消息

    // 向消息数组中添加 我 发送的消息
    messages.value.push({
      id: Date.now(),//唯一ID
      sender: '我',
      content: messageContent,
      timestamp,//时间戳
      userId: selectedUser.value.id//接收者ID
    });

    // 向消息数组中添加 对方 回发的消息
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        sender: selectedUser.value.name,
        content: `${messageContent}！`, //回复的内容：包含我刚发的消息
        timestamp,
        userId: selectedUser.value.id//发送者的ID
      });
    }, 500);//500ms后回复

    // 新消息发送后，清空输入框
    newMessage.value = '';
  }
}

// 仅显示与选中用户相关的消息       基于messages 数组和selectedUser创建一个新数组
const filteredMessages = computed(() => messages.value.filter(message => message.userId === selectedUser.value.id))

//与选定的用户聊天
const selectUser = (user) => {
  selectedUser.value = user
  // 初始化与用户相关的消息列表
  if (!messages.value.some(message => message.userId === user.id)) {
    messages.value = messages.value.filter(message => message.userId === user.id)
  }
}

//跳转
const back = ()=>{
    router.push("/HomePage")
}

</script>
  
<style scoped>
  .app-container {
    display: flex;
    height: 100vh;
  }
  .back-button {

  top: 35px; /* 距顶部20px */
  left: 35px; /* 距左侧20px */
  background: #f0f0f0;
}

  .user-list {
    width: 200px;
    background: #f0f0f0;
    padding: 20px;
    text-align: center;
  }
  
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .chat-window {
    flex-grow: 1;
    overflow-y: auto;
    border-left: 1px solid #ddd;
    padding: 20px;
  }
  
.chat-header {
  text-align: center; /* 文本居中 */
  font-size: 1.5em; /* 字体大小增加，1.5倍于正常大小 */
  font-weight: bold;
  margin-bottom: 20px;
}
  
  .chat-messages {
    margin-bottom: 20px;
  }
  
  .message {
    margin-bottom: 10px;
  }

/* 回我的消息 */
.message-info {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
  
  .message-sender {
    font-weight: bold;
  }
  
  .message-timestamp {
    color: #888;
  }
  
  .message-content {
  padding: 10px;
  border-radius: 15px;
  max-width: 60%;
  word-break: break-word;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

/* 您发送的消息样式 */
.message.mine {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 右对齐 */
}

.message.mine .message-content {
  background-color:rgb(138, 218, 138); /* 您的消息气泡颜色 */
  margin-left: auto;
  margin-right: 0;
  /* 其他样式 */
}
  
/* 对方发送的消息样式 */
.message.theirs {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
}
.message.theirs .message-content {
  background-color: #f5f5f5; /* 对方的消息气泡颜色 */
  margin-right: auto;
  margin-left: 0;
  /* 其他样式 */
}
  .message-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
  
  .message-input > * {
    margin: 0 5px;
  }
  </style>