//测试路由
// 引入express模块
const express = require("express")
// 创建路由实例
const router = express.Router()
// 引入数据库操作相关的工具函数db和genid
const { db, genid } = require("../db/DbUtils")

router.get("/test", async (req, res) => {
    // 使用异步函数方式查询数据库
    let out = await db.async.all("select * from `admin`", []);//等待查询

    // 返回查询结果和生成的id
    res.send({
        id: genid.NextId(),//循环id
        out //out当作输出，相当于 out:out
    })
})

// 导出路由实例
module.exports = router