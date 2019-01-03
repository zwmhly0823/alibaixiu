// const fs = require('fs')

// fs.readdir('./routes/', (err, files) => {
//   if (err) {
//     throw err
//   }
//   console.log(files)
// })

var glob = require("glob")

// ./routes/*.js 获取 routes 目录下所有以 .js 结尾的文件（不包括子目录）
glob("./routes/**/*.js", function (err, files) {
  if (err) {
    throw err
  }
  console.log(files)
})
