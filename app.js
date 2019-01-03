const express = require('express')
const path = require('path')
const router = require('./routes/index')
const adminRouter = require('./routes/admin')
const glob = require('glob')
const session = require('express-session')

/**
 * 配置 Session 数据持久化
 * 参考文档：https://github.com/chill117/express-mysql-session#readme
 * 该插件会自动往数据库中创建一个 sessions 表，用来存储 Session 数据
 */

const MySQLStore = require('express-mysql-session')(session)

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'alishow62'
})

const app = express()

// 当你需要在多个页面使用相同的模板数据成员的时候
// 你可以把这个数据成员放到 app.locals 属性中
// app.locals 是一个对象
// 往 app.locals 中添加成员，相当于为每一个 res.render('模板文件', 数据对象（混合了 app.locals 中的成员）)
// app.locals.hahaha = '哈哈哈'

/**
 * 配置使用 Session 中间件
 * 参考文档：https://github.com/expressjs/session
 * 如何使用：
 *   存储Session数据：req.session.xxx = xxx
 *   读取：req.session.xxx
 *
 * Session 数据默认存储在内存中，服务器一旦重启，Session 数据就会丢失
 */
app.use(session({
  secret: 'keyboard cat',
  // resave: false,
  saveUninitialized: true,
  store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
  cookie: { // 配置 Session 自动下发的 Cookie 小票的信息
    // Cookie 的过期时间不是给服务器用的，是给客户端用的
    // 客户端在发送 Cookie 到服务器之前会校验 Cookie 的过期时间
    // 如果 Cookie 过期了，客户端就不发送
    // 如果 Cookie 没有过期，客户端才会发送携带过来
    
    // expires 不推荐使用，因为客户端和服务器时间不一定一致
    // expires: '', // 给一个绝对时间，xx年xx月xx日 xx点xx分xx秒，
    // maxAge: 1000 * 60 // 相对（滑动）时间，给一个毫秒数，相对于现在的时间往后加 xxx 毫秒，再过期
  }
}))

/**
 * 开放静态资源
 */
app.use('/public', express.static(path.join(__dirname, './public')))

/**
 * 配置使用 art-template 模板引擎
 *   app.engine 方法的第一个参数用来指定模板文件的后缀名
 */
app.engine('html', require('express-art-template'))
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})

/**
 * 配置解析表单 POST 请求体
 * 该方法内部使用的是 body-parser
 * 该中间件会将请求体解析为一个对象，挂载到 req.body 中
 * 这个中间件只能解析请求方法为 POST，请求内容的类型 Content-Type 为 x-www-url-encoded 格式的数据
 */
app.use(express.urlencoded())

/**
 * 统一控制后台管理系统的页面访问权限
 * 相当于为所有以 /admin/xxxxx 开头的请求设置了一道关卡
 * 所有以 /admin 开头的请求都会先进入当前这个处理函数
 * 
 */
app.use('/admin', (req, res, next) => {
  // 1. 如果是登录页面 /admin/login，允许通过
  if (req.originalUrl === '/admin/login') {
    // 这里 next() 就会往后匹配调用到我们的那个能处理 /admin/login 的路由
    return next()
  }

  // 2. 其他页面都一律验证登录状态
  const sessionUser = req.session.user
  //    如果没有登录页， 让其重定向到登录页
  if (!sessionUser) {
    return res.redirect('/admin/login')
  }

  app.locals.sessionUser = sessionUser

  // 如果登录了，则允许通过
  // 这里调用 next 就是调用与当前请求匹配的下一个中间件路由函数
  // 例如，当前请求是 /admin/users ，则 next 会找到我们那个匹配 /admin/users 的路由去处理
  //                  /admin/categories ，则 next 会找到我们添加的那个 /admin/categories 的路由去处理
  next()
})

// 每增加一个路由模块，都来手动挂载，太麻烦
// 这里提供一个优化的方式：自动挂载
// 思路：得到所有的路由模块路径，循环，每循环一次，就执行一次
//    app.use('/admin', require('路由模块路径'))

// 获取 routes 目录中所有的路由文件模块路径
// 注意：暂时使用同步获取或者异步获取无所谓
//       但是如果路由后面还有其他中间件，则可能就会有问题
//       所以为了保证路由的匹配顺序绝对没有问题。推荐使用同步获取
const routerFiles = glob.sync('./routes/**/*.js')

// 循环路由模块路径，动态加载路由模块挂载到 app 中
routerFiles.forEach(routerPath => {
  const router = require(routerPath)
  if (typeof router === 'function') {
    // router.prefix 是我们添加的自定义属性，作用是用来设定路由的模块的访问前缀
    // 当路由模块没有 prefix 的时候，我们给一个 / 作为默认值，相当于没有前缀限制。
    // 因为所有的请求路径都以 / 开头
    app.use(router.prefix || '/', router)
  }
})

/**
 * 统一错误处理
 * 注意：四个参数，。缺一不可
 *   1 错误对象
 *   2 请求对象
 *   3 响应对象
 *   4 匹配下一个中间件的处理函数
 */
app.use((err, req, res, next) => {
  // console.log('错误处理中间件执行到了')
  res.status(500).send({
    statusCode: 500,
    message: 'Internal Server error',
    error: err.message // 具体的报错信息，任务错误对象都有一个属性 message
  })

  // 记录错误信息
  //    错误发生时间、发生的脚本、代码的行号，具体的错误信息，哪个方法报的错
  //    发送邮件、短信等给负责人或是管理员、开发人员等去赶紧的修复
})

app.listen(3000, () => console.log('Server running http://127.0.0.1:3000/'))
