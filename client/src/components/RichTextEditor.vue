 <!-- 把富文本封装成组件，组件封装了富文本编辑器的功能，方便组件重复集成和使用， -->

<template>
     <!-- <Toolbar> 和 <Editor> 组件从 @wangeditor/editor-for-vue 引入工具栏和编辑器 -->
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />         <!-- 用于双向绑定编辑器的内容 -->
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />  <!--编辑器的事件监听器-->
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';//样式
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'//引入的组件
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")//从main.js里面的provide中获取服务端地址

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();//存储编辑器实例
const toolbarConfig = { excludeKeys:["uploadVideo"] };//排除上传视频的功能，定义工具栏配置
const editorConfig = { placeholder: '请输入内容...' };//定义编辑器的配置
//上传图片
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, // 图片小于10kb，不会上传
    server: server_url+'/upload/rich_editor_upload',//上传到服务端的地址    
}
//插入图片之前的函数，上传成功后服务端返回不完整的http地址，拼装成完整的服务端地址
editorConfig.MENU_CONF['insertImage'] ={
    parseImageSrc:(src) =>{
        if(src.indexOf("http") !==0){
            return `${server_url}${src}`
        }
        return src
    }
}

const mode = ref("default")
const valueHtml = ref("")//响应式引用，存储编辑器的 HTML 内容

//定义组件的 props 
const props = defineProps({
    modelValue: {
        type: String,//类型字符串
        default: ""//默认空
    }
})
//定义组件的 emit 
const emit = defineEmits(["update:model-value"])//数组

let initFinished = false//一开始不初始化
//生命周期钩子用于初始化和清理编辑器实例。
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 200);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};

//富文本发生变化时，抛出一个事件
const handleChange = (editor) => {
    if (initFinished) {//修改后抛出去
        emit("update:model-value", valueHtml.value)
    }
};

</script>

<style lang="scss" scoped>
</style>