const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/upload')

router.post('/api/upload', upload.single('file'), (req, res, next) => {
  // req.file
  res.send({
    success: true,
    data: '/public/uploads/' + req.file.filename
  })
})

module.exports = router
