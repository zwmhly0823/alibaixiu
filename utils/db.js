const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

// connection.connect()

// 直接导出 connection 连接对象
// 然后就可以在外部加载 db.js 模块，得到内部的 connection 连接对象
// 然后调用 connection.query 方法执行数据库操作了
module.exports = pool

// 千万不要结束连接
// connection.end()
