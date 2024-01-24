//管理员登录路由
const express = require("express"); // 引入Express框架
const { v4: uuidv4 } = require("uuid"); // 引入uuid模块，这个模块可以生成全球唯一的ID，通常用于生成token等
const { db, genid } = require("../db/DbUtils"); //引入自定义的数据库工具模块，这个模块封装了数据库操作

//创建一个新的路由器实例，定义多个路由来处理客户端请求
const router = express.Router(); 

router.post("/login", async (req, res) => {//req前端传给服务端
    // 定义登录路由的处理函数
    let { account, password } = req.body; // 通过req.body获取客户端提交的account（账号）和password（密码）。

    // 数据库查询，异步查询数据库
    let { err, rows } = await db.async.all( //err是错误反馈，rows是返回的对应数组
        "select * from `admin` where `account` = ? AND `password` = ?",
        [account, password]
    );

    if (err == null && rows.length > 0) {
        //token用于后续的身份验证和会话管理
        let login_token = uuidv4(); // 生成一个唯一的token，前后端交互的媒介是token，token给前端，可以验证登录，每次都不一样
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"; // 更新管理员信息中的token的SQL语句

        //将新生成的login_token更新到数据库中
        await db.async.run(update_token_sql, [login_token, rows[0].id]);//rows是数组，只有一条数据
        
        //登录成功
        let admin_info = rows[0]; //rows是数组，只检索一条信息，把检索到的管理员信息赋值给admin_info变量。
        
        //将接下来的响应中返回给客户端
        admin_info.token = login_token; // 将生成的token添加到管理员信息中
        admin_info.password = ""; // 将密码字段置为空

        res.send({// 返回登录成功的响应
            code: 200,//状态码，表示成功
            msg: "登录成功",
            data: admin_info
        }); 
    } else { // 返回登录失败的响应
        res.send({
            code: 500,
            msg: "登录失败"
        });
    }
});

module.exports = router; // 导出路由器对象，可以被其他文件（如主应用文件）引入并使用。