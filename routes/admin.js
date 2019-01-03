/**
 * 管理系统相关视图（渲染页面）路由放到了这里
 */

const express = require('express')
const db = require('../utils/db')

const router = express.Router()

// 为 router 添加一个自定义成员
router.prefix = '/admin'

router.get('/', (req, res, next) => {
  // 当前页面需要具备登录状态
  // const sessionUser = req.session.user

  // 如果没有登录，让用户跳转到登录页
  // if (!sessionUser) {
    // res.redirect 的作用是服务端重定向
    // 该方法会发送一个 302 状态码
    // 然后在响应头中加入一个名字叫 Location 的字段，值是我们给的 /admin/login
    // 浏览器收到响应之后，看到是 302 状态码，浏览器会去响应头中找到 Location 然后再次请求
    // return res.redirect('/admin/login')
  // }

  // 代码执行到这里，意味着用户具有登录状态，正常渲染当前页面

  // res.render 渲染的页面可以使用 render 第二个参数提供的数据
  // 不仅它直接渲染的这个页面可以使用这个数据对象中的数据
  // 页面继承的模板页，包括模板页中 include 的任何页面都可以使用这个数据对象中的成员
  // req.session.user
  // res.render('admin/index.html', {
  //   sessionUser: req.session.user
  // })

  res.render('admin/index.html')
})

router.get('/login', (req, res, next) => {
  res.render('admin/login.html')
})

router.get('/categories', (req, res, next) => {
  res.render('admin/categories.html', {
    foo: 'bar'
  })
})

router.get('/users', (req, res, next) => {
  res.render('admin/users.html')
})

router.get('/posts', (req, res, next) => {
  res.render('admin/posts.html')
})

router.get('/posts/new', (req, res, next) => {
  db.query('SELECT * FROM `ali_cate`', (err, ret) => {
    if (err) {
      return next(err)
    }
    res.render('admin/posts-new.html', {
      categories: ret
    })
  })
})

module.exports = router
