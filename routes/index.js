/**
 * 普通客户端相关路由（页面渲染）放到了这里
 */

const express = require('express')

// 独立的路由模块
const router = express.Router()

// 为 router 添加一个自定义成员
router.prefix = '/'

router.get('/', (req, res, next) => {
  // res.render 本质就是封装了文件读取和模板引擎渲染
  // 1. 读取指定的模板文件
  // 2. 使用模板引擎解析替换模板字符串
  // 3. 把处理的结果发送给客户端
  res.render('index.html')
})

router.get('/list', (req, res, next) => {
  res.render('list.html')
})

module.exports = router
