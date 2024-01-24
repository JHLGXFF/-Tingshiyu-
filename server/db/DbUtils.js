//该篇代码用来连接数据库SQlite的类
const sqlite3 = require("sqlite3").verbose(); // 引入与SQLite数据库交互的Node.js模块
const path = require("path"); // 引入用来处理文件系统路径的模块
const GenId = require("../utils/SnowFlake"); // 引入自定义的雪花SnowFlake模块，用于生成唯一ID

//创建数据库对象
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"));//使用sqlite3.Database创建一个连接到blog.sqlite3数据库文件的对象
const genid = new GenId({ WorkerId: 1 }); // WorkerId=1，服务器创建时不会有id重复。 创建一个SnowFlake对象，用于生成唯一ID

//异步操作封装
db.async = {};// 一个封装了对数据库的异步操作的新对象

// 封装db.all，异步SQL查询
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {//返回一个Promise对象
        // 调用db.all方法执行查询操作
        db.all(sql, params, (err, rows) => {//回调函数
            resolve({ err, rows }); // 将查询结果返回
        });
    });
};

// 封装db.run，异步SQL更新
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        // 调用db.run方法执行更新操作
        db.run(sql, params, (err, rows) => {//异步地执行SQL更新操作
            resolve({ err, rows }); // 将更新结果返回
        });
    });
};

module.exports = { db, genid }; // 导出db对象和genid对象，使其可以在其他地方使用