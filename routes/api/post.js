/**
 * 文章相关路由接口
 */

const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const upload = require('../../middlewares/upload')

// 告诉 multer，把接受到的文件存储到指定的目录
// 这里的这个目录相对于执行 node 命令的路径
// 简单理解，相对于项目的根目录
// const upload = multer({ dest: 'public/uploads' })

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads')
//   },
//   filename: function (req, file, cb) {
//     // file.fieldname 是表单中存储文件的那个字段名称
//     // feature-时间戳
//     const extName = path.extname(file.originalname)
//     const randomBytes = crypto.randomBytes(15).toString('hex')
//     cb(null, `${randomBytes}-${Date.now()}${extName}`)
//   }
// })

// const upload = multer({ storage: storage })

router.prefix = '/api/posts'

router.get('/', (req, res, next) => {
  // /api/posts?_page=要查看的页码&_limit=每页多大
  // url 地址中的数据都是字符串
  let { _page = 1, _limit = 10 } = req.query
  _page = parseInt(_page)
  _limit = parseInt(_limit)

  db.query(
    'SELECT * FROM `ali_article` LIMIT ?,?',
    [
      (_page - 1) * _limit, // 要跳过的记录条数
      _limit // 要取出的记录条数
    ],
    (err, listRet) => {
      if (err) {
        return next(err)
      }
      db.query('SELECT COUNT(*) as count FROM `ali_article`', (err, countRet) => {
        if (err) {
          return next(err)
        }
        res.send({
          success: true,
          data: {
            list: listRet,
            count: countRet[0].count
          }
        })
      })
    })
})

router.post('/create', upload.single('feature'), (req, res, next) => {
  // 1. 获取表单数据
  //    如果解析带有文件的表单 POST 提交，使用 Express 官方提供的 multer 中间件
  //    数据库中存储文件的Web访问路径
  // console.log(req.file) // 接收到的文件信息（文件名，大小，修改时间...）
  // console.log(req.body) // 不包含文件字段的普通数据

  const { body, file } = req

  // 2. 添加数据库
  db.query('INSERT INTO `ali_article` SET ?', {
    article_title: body.title,
    article_body: body.content,
    article_adminid: req.session.user.admin_id, // 文章作者，当前登录用户的 id
    article_cateid: body.category,
    article_slug: body.slug,
    // article_addtime: body
    article_status: body.status,
    article_file: `/${file.destination}/${file.filename}` // 存储上传文件的 Web 访问路径
  }, (err, ret) => {
    if (err) {
      return next(err)
    }

    // 3. 发送响应结果
    res.send({
      success: true,
      data: ret
    })
  })
})

module.exports = router
