//与博客操作相关的后端代码
// 使用 Express 框架
const express = require("express")
// 创建路由对象
const router = express.Router()
// 引入数据库相关的工具函数
const { db, genid } = require("../db/DbUtils")

// 获取博客详情
router.get("/detail", async (req, res) => {
    // 从请求参数中获取博客id
    let { id } = req.query
    // 构造查询博客详情的SQL语句
    let detail_sql = "SELECT * FROM blog WHERE id = ? "
    // 执行查询博客详情的SQL语句
    let { err, rows } = await db.async.all(detail_sql, [id]);

    // 判断查询是否成功
    if (err == null) {
        // 如果成功，返回查询结果
        res.send({
            code: 200,
            msg: "获取成功",
            rows
        })
    } else {
        // 如果失败，返回错误信息
        res.send({
            code: 500,
            msg: "获取失败"
        })
    }
})

// 查询博客
router.get("/search", async (req, res) => {

    /**主要功能有：
     * keyword 根据title或者content的关键字查询
     * categoryId 根据分类ID查询
     * 
     * 分页：
     * page 页码，前端传回来
     * pageSize 每页显示的博客数量。前端传回来
     * 
     */
    // 从前端中获取关键字、分类编号、页码和分页大小
    let { keyword, categoryId, page, pageSize } = req.query

    // 设置默认值
    page = page == null ? 1 : page;//page没传，默认为1，否则为传回来的值
    pageSize = pageSize == null ? 10 : pageSize
    categoryId = categoryId == null ? 0 : categoryId
    keyword = keyword == null ? "" : keyword

    // 定义参数和SQL语句的数组
    let params = []//储存参数
    let whereSqls = []//记录SQL语句

    // 判断是否有分类编号
    if (categoryId != 0) {//传的是分类id
        // 如果有分类编号，将分类编号添加到参数数组和SQL语句数组中
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId)
    }

    // 判断是否有关键字
    if (keyword != "") {
        // 有关键字，则关键字添加到参数数组和SQL语句数组
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")//模糊查询，标题或内容存在关键字都可以查询出来
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    // 构造WHERE子句，把前面的语句都一起拼装起来
    let whereSqlStr = ""
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")//如果数组不为空，则将所有条件用AND连接起来
    }
    

    //定义两个SQL查询
    //  searchSql用于查询分页后的博客数据。SQL语句和参数数组           //截断文章内容                             //内容字段的字符数为50个                             //LIMIT子句使用了页码和每页大小来计算要跳过的记录数和要返回的记录数。
    let searchSql = " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "//还根据创作时间排序
    //1  10   --》 0，10 分页的运算
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // searchCountSql查询满足条件的博客总数。SQL语句和参数数组（201条数据，每页10条，要21页）
    let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
    let searchCountParams = params

    // 异步执行这两个查询-->查询分页数据和数据总数
    let searchResult = await db.async.all(searchSql, searchSqlParams)//语句，参数
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    // 打印查询结果
    console.log(searchSql, countResult)

    // 判断查询是否成功
    if (searchResult.err == null && countResult.err == null) {//两条查询语句都不报错 
        // 如果成功，包含搜索结果的对象作为JSON发送回前端。
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                categoryId,
                page,
                pageSize,
                rows: searchResult.rows,//查到的数据
                count: countResult.rows[0].count//分页的大小
            }
        })
    } else {
        // 如果失败，返回错误信息
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }
})


// 删除接口 /blog/delete?id=xxx
// 创建一个路由，当接收到 DELETE 请求时，执行以下代码
router.delete("/_token/delete", async (req, res) => {
    // 从请求的查询参数中获取id
    let id = req.query.id

    // 构造删除博客的 SQL 语句
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"

    // 使用异步函数执行 SQL 语句，并将结果赋值给 err 和 rows
    let { err, rows } = await db.async.run(delete_sql, [id])

    // 如果执行 SQL 语句没有出错
    if (err == null) {
        // 返回成功的响应
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        // 返回失败的响应
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})

// 添加博客接口
// 创建一个路由，当接收到 POST 请求时，执行以下代码
router.post("/_token/add", async (req, res) => {

    // 从请求的消息体中获取需要添加的博客信息
    let { title, categoryId, content } = req.body;
    // 生成一个唯一的博客id
    let id = genid.NextId();
    // 获取当前时间戳作为博客的创建时间,毫秒
    let create_time = new Date().getTime();

    // 构造插入博客的 SQL 语句
    const insert_sql = "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    let params = [id, title, categoryId, content, create_time]//定义上面的参数

    // 使用异步函数执行 SQL 语句，并将结果赋值给 err 和 rows
    let { err, rows } = await db.async.run(insert_sql, params)

    // 如果执行 SQL 语句没有出错
    if (err == null) {
        // 返回成功的响应
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        // 返回失败的响应
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
})

// 导出路由模块
module.exports = router