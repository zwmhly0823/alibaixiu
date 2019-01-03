const fs = require('fs')


// 封装一个 Promise 版本的 readFile
function pReadFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function pSetTimeout(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

pSetTimeout(1000)
  .then(() => {
    return pReadFile('./data/a.txt')
  })
  .then(data => {
    console.log(data)
    return pSetTimeout(2000)
  })
  .then(() => {
    return pReadFile('./data/b.txt')
  })
  .then(data => {
    console.log(data)
  })
  .then(() => {
    console.log('Game Over...')
  })







// pReadFile('./data/a.txt')
//   .then(function (data) {
//     console.log(data)
//     // 这里 return 的是 pReadFile 的执行结果
//     return pReadFile('./data/b.txt')
//   })
//   .then(data => {
//     console.log(data)
//     return pReadFile('./data/c.txt')
//   })
//   .then(data => {
//     console.log(data)
//   })

// readFile('xxx', function (err, data) {
//   console.log(data)
// })

// readFile('路径')
//   .then(data => {
//     console.log(data)
//   })
