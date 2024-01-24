//上传功能，富文本编辑器框架，配合富文本编辑器处理文件上传功能
//这个路由处理程序定义了一个用于处理富文本编辑器上传文件的 POST 请求的接口
// 引入express模块
const express = require("express")
// 创建路由实例
const router = express.Router()
// 引入文件系统模块
const fs = require("fs") 
// 引入数据库操作相关的工具函数db和genid
const { db, genid } = require("../db/DbUtils")

// 富文本编辑器上传接口
router.post("/rich_editor_upload", async (req, res) => {
    // 判断是否有文件上传
    if (!req.files) {
        // 没有文件上传，返回失败信息
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    }

    // 获取上传的文件数组
    let files = req.files;
    // 定义返回的文件路径数组
    let ret_files = [];

    // 遍历上传的文件数组
    for (let file of files) {
        // 获取文件名字后缀  找到最后一个.进行裁剪    aa.jpg
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        // 生成随机文件名字,雪花算法起名字
        let file_name = genid.NextId() + "." + file_ext

        // 修改文件名字并移动文件到指定目录
        fs.renameSync(//Sync同步进行
            process.cwd() + "/public/upload/temp/" + file.filename,//程序允许的目录路径
            process.cwd() + "/public/upload/" + file_name//移到这个目录下，名字变成刚才新起的名
        )
        // 文件名字保存起来
        ret_files.push("/upload/" + file_name)
    }

    // 返回成功信息和上传成功的文件路径
    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，虽然files默认拿回来多张图片，但每次只有一张图片
        }
    })
})

// 导出路由实例
module.exports = router