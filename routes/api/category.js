/**
 * 分类相关路由接口
 */

const express = require('express')
const db = require('../../utils/db')

const router = express.Router()

// 为 router 添加一个自定义成员
router.prefix = '/api/categories'

router.get('/', (req, res, next) => {
  // 从数据库中把分类数据捞出来
  db.query('SELECT * FROM `ali_cate`', (err, ret) => {
    if (err) {
      // throw err

      // 这里的 return 的作用是为了停止代码的后续执行
      // return res.sendStatus(500)

      // return res.status(500).send({
      //   statusCode: 500,
      //   message: 'Internal Server error',
      //   error: err.message // 具体的报错信息，任务错误对象都有一个属性 message
      // })

      // 当错误发生的时候，调用 next ，传入错误对象（必须的）
      // next(错误对象) 会往后找到带有四个参数的中间件处理函数
      return next(err)
    }

    // 发送响应给客户端
    res.send({
      success: true,
      data: ret
    })
  })
})

router.get('/delete', (req, res, next) => {
  const { id } = req.query
  db.query('DELETE FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      // throw err
      return next(err)
    }
    res.send({
      success: true
    })
  })
})

router.post('/create', (req, res, next) => {
  // 1. 获取表单请求体数据
  const body = req.body

  // 2. 操作数据库，执行插入数据
  //    sql 语句中的 ? 不是 SQL 语法，在这里是一个占坑符
  //    mysql 包中的 query 方法，会将第二个参数对象转换为 filed1=value1,filed2=value2... 数据格式，把 SQL 语句中的 ? 替换掉
  db.query('INSERT INTO `ali_cate` SET ?', {
    cate_name: body.name,
    cate_slug: body.slug
  }, (err, ret) => {
    if (err) {
      // throw err
      return next(err)
    }
    
    // 3. 发送响应
    res.send({
      success: true,
      data: ret
    })
  })
})

router.get('/query', (req, res, next) => {
  // 1. 获取查询字符串中的数据 id
  const { id } = req.query

  // 2. 操作数据库，执行查询 SQL 语句
  db.query('SELECT * FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      // throw err
      return next(err)
    }

    // 3. 发送响应
    res.send({
      success: true,
      data: ret[0]
    })
  })
})

router.post('/update', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body

  // 2. 基本数据校验
  
  // 3. 操作数据库，执行编辑
  db.query(
    'UPDATE `ali_cate` SET `cate_name`=?, `cate_slug`=? WHERE `cate_id`=?',
    [body.cate_name, body.cate_slug, body.cate_id],
    (err, ret) => {
      if (err) {
        // throw err
        return next(err)
      }

      // 4. 发送响应
      res.send({
        success: true,
        data: ret
      })
    }
  )
})

module.exports = router
