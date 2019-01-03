const fs = require('fs')

setTimeout(function () {
  fs.readFile('./data/a.txt', function (err, data) {
    if (err) {
      throw err
    }
    console.log(data.toString())
    setTimeout(function () {
      fs.readFile('./data/b.txt', function (err, data) {
        if (err) {
          throw err
        }
        console.log(data)
        setTimeout(function () {
          fs.readFile('./data/c.txt', function (err, data) {
            if (err) {
              throw err
            }
            console.log(data)
          })
        }, 3000)
      })
    }, 2000)
  })
}, 1000)
