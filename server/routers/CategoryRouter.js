//分类的增删查改路由写法
const express = require("express")// 引入express模块
const { db, genid } = require("../db/DbUtils")//引入自定义数据库工具模块
// 创建路由实例
const router = express.Router()

// 列表接口，处理GET请求，通常用于请求数据。响应HTTP GET请求
router.get("/list", async (req, res) => {//req请求对象，res响应对象
    // 定义查询语句
    const search_sql = "SELECT * FROM category"

    // 使用数据库工具函数查询数据库
    let { err, rows } = await db.async.all(search_sql, [])//查询

    // 判断查询结果是否成功
    if (err == null) {
        // 查询成功，返回查询结果
        res.send({
            code: 200,
            msg: "查询成功",
            rows //rows:rows
        })
    } else {
        // 查询失败，返回错误信息
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }
})

// 删除接口，处理DELETE请求，通常用于删除数据。
router.delete("/_token/delete", async (req, res) => {
    // 从前端拿id
    let id = req.query.id
    // 定义删除语句
    const delete_sql = "DELETE FROM category WHERE id = ?"
    // 使用数据库工具函数执行删除操作
    let { err} = await db.async.run(delete_sql, [id])
    // 判断删除操作是否成功
    if (err == null) {
        // 删除成功，返回成功信息
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        // 删除失败，返回错误信息
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})

// 修改接口，处理PUT请求，通常用于修改现有数据。
router.put("/_token/update", async (req, res) => {

    // 前端要把id和名字传过来
    let { id, name } = req.body
    // 定义更新语句
    const update_sql = "UPDATE category SET name = ? WHERE id = ? "
    // 使用数据库工具函数执行更新操作
    let { err, rows } = await db.async.run(update_sql, [name, id])

    // 判断更新操作是否成功
    if (err == null) {
        // 更新成功，返回成功信息
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        // 更新失败，返回错误信息
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
})

// 添加接口，处理POST请求，通常用于提交数据来创建新的记录。
router.post("/_token/add", async (req, res) => {
    // 获取请求体中的name参数
    let { name } = req.body//前端传递数据，id不用，可以有服务端自己生成
    // 定义插入语句
    const insert_sql = "INSERT INTO category (id,name) VALUES (?,?)"
    // 使用数据库工具函数执行插入操作
    let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name])//顺序一一对应

    // 判断插入操作是否成功
    if (err == null) {
        // 插入成功，返回成功信息
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        // 插入失败，返回错误信息
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
})

// 导出路由实例
module.exports = router