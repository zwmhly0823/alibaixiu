/**
 * 用户接口相关路由
 */
const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const md5 = require('../../utils/md5')

router.prefix = '/api/users'

router.get('/', (req, res, next) => {
  db.query('SELECT * FROM `ali_admin`', (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret
    })
  })
})

router.post('/create', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body

  // 2. 数据校验
  // 2.1 基本数据校验（例如邮箱是否为空）
  // 2.2 业务数据校验(例如邮箱是否可用)

  // 2.2.1 验证邮箱是否重复
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    // ret [][0] undefined false
    // ret [数据][0] 数据对象 true
    if (ret[0]) {
      return res.send({
        success: false,
        message: '邮箱已被占用'
      })
    }

    // 2.2.2 验证别名是否可用
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?', [body.admin_slug], (err, ret) => {
      if (err) {
        return next(err)
      }
      if (ret[0]) {
        return res.send({
          success: false,
          message: '别名已被占用'
        })
      }

      // 2.2.3 验证昵称是否可用
      db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?', [body.admin_nickname], (err, ret) => {
        if (err) {
          return next(err)
        }
        if (ret[0]) {
          return res.send({
            success: false,
            message: '昵称已被占用'
          })
        }

        // 邮箱、别名、昵称都没有被占用，可以使用，执行插入操作完成用户注册
        // 3. 校验通过，执行数据插入操作
        db.query('INSERT INTO `ali_admin` SET ?', {
          admin_email: body.admin_email,
          admin_slug: body.admin_slug,
          admin_nickname: body.admin_nickname,
          admin_pwd: md5(md5(body.admin_pwd))
        }, (err, ret) => {
          if (err) {
            return next(err)
          }

          // 4. 发送响应
          res.send({
            success: true,
            data: ret
          })
        })
      })
    })
  })
})

router.get('/check_email', (req, res, next) => {
  // 1. 获取查询参数 admin_email
  const { admin_email } = req.query

  // 2. 操作数据库，查询 admin_email 是否已存在
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }

    // 3. 如果已存在，则发送响应 false
    //    如果不存在，表示可以使用，发送响应 true
    res.send(ret[0] ? false : true)
  })
})

router.post('/login', (req, res, next) => {
  // 1. 获取表单数据
  const body = req.body

  // 2. 数据验证
  // 2.1 基本数据验证
  
  // 2.2 业务数据验证
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }

    const user = ret[0]

    // . 发送响应
    //    如果用户不存在，告诉用户
    //    如果密码错误，告诉用户

    // 2.2.1 如果用户不存在
    if (!user) {
      return res.send({
        success: false,
        message: '用户不存在'
      })
    }

    // 2.2.2 判断密码是否正确
    if (md5(md5(body.admin_pwd)) !== user.admin_pwd) {
      return res.send({
        success: false,
        message: '密码错误'
      })
    }

    // 2.2.3 用户存在，密码正确，发送成功响应

    // 用户登录成功，把用户的状态信息存储到 Session 中
    // 往 req.session 中存储了一个名字叫 user，值是我们从数据库中读取出来的用户信息对象
    req.session.user = user

    res.send({
      success: true,
      message: '登录成功'
    })
  })
})

router.get('/logout', (req, res, next) => {
  // 1. 清除登录状态
  delete req.session.user

  // 2. 跳转到登录页
  res.redirect('/admin/login')
})

module.exports = router
