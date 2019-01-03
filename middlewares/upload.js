const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    // file.fieldname 是表单中存储文件的那个字段名称
    // feature-时间戳
    const extName = path.extname(file.originalname)
    const randomBytes = crypto.randomBytes(15).toString('hex')
    cb(null, `${randomBytes}-${Date.now()}${extName}`)
  }
})

const upload = multer({ storage: storage })

module.exports = upload
