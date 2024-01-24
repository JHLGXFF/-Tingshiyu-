/**服务端的入口,node app.js
"multer"处理上传功能的中间件 pnpm install multer
"sqlite3"数据库pnpm install sqlite3
"uuid"生成不同的id标识 pnpm install uuid
 */
const express = require("express")//引入express
const multer = require("multer")//中间件
const path = require("path")
const app = express();//实例化express
const { db, genid } = require("./db/DbUtils")
const port = 8080//端口

//先开放跨域请求，
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");//所有域名都能过来
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");//*代表全部头都能接受
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

app.use(express.json())//解析里面的内容
const update = multer({//上传
    dest: "./public/upload/temp"//上传的临时目录
})
app.use(update.any())//允许所有接口有上传功能   
//指定静态资源路径，没有这一行，资源会传不上去
app.use(express.static(path.join(__dirname, "public")))

//中间件，验证管理员权限。拦截所有进入应用的请求，并检查是否需要进行权限验证
const ADMIN_TOKEN_PATH = "/_token"//定义了一个常量，在后续逻辑中作为标识符
app.all("*", async (req, res, next) => {//对所有进入应用的请求（GET、POST、PUT等）执行这个中间件函数
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {//请求路径包含字符串，此请求需要管理员权限。

        let { token } = req.headers;
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql, [token])

        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return
        } else {//验证通过（即找到了对应的管理员记录且无错误）
            next()
        }
    } else {//请求路径不包含"/_token"，直接调用next()继续处理请求
        next()
    }
})

//注册路由接口 
app.use("/test", require("./routers/TestRouter"))
app.use("/admin", require("./routers/AdminRouter"))
app.use("/category", require("./routers/CategoryRouter"))
app.use("/blog", require("./routers/BlogRouter"))
app.use("/upload", require("./routers/UploadRouter"))

app.get("/", (req, res) => {//一个hello world 的接口
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`启动成功 : http://localhost:${port}/`)
})

