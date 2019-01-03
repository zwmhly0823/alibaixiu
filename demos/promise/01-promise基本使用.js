// Promise 就是承诺、许诺、
// I promise you. 我向你保证。
// 
// 在 ECMAScript 6 中，新增了一个构造函数：Promise
// Promise 用于解决异步回调代码嵌套的问题
// 可以以一种很优雅的代码来进行异步任务流程控制

// Promise 的使用
// 一、封装
//  1. 创建一个 Promise 对象
//  2. Promise 构造函数接收一个函数作为参数
//  3. 函数有两个参数
//     resolve
//     reject
//  4. 在参数函数中（Promise容器中）进行异步任务操作（读写文件、定时器、操作数据库）...
//  5. 承诺可能成功，也可能失败
//     所以
//     当承诺中的异步任务成功的时候，调用 resolve 让承诺成功
//     失败的时候，让承诺失败
//     
//  创建 Promise 容器对象
//  执行异步操作
//  根据异步操作结果调用 resolve、reject

const fs = require('fs')

const p1 = new Promise(function (resolve, reject) {
  fs.readFile('./data/a.txt', 'utf8', (err, data) => {
    if (err) {
      // 承诺失败，调用 reject，把错误对象传递进去
      reject(err)
    } else {
      // 承诺成功，调用 resolve，如果有数据就把数据传递进去
      resolve(data)
    }
  })
})

// 二、获取承诺的结果
// Promise 对象有一个 then 方法
// then 方法接受两个参数
//   第1个是: 成功的 resolve
//   第2个是（可选参数）： 失败的 reject
// p1.then(function (data) {
//   console.log('成功了 => ', data)
// }, function (err) {
//   console.log('失败了 => ', err)
// })


// 1. then 之后可以继续链式的调用任意个 then 函数
// 2. then 函数可以有返回值
p1
  .then(function (data) { // 第1个 then 的结果是 Promise 的 resolve 的结果
    console.log(data)
    // return 普通数据没有意义
    // return 111

    // 只有当 return 一个 Promise 对象的时候才有意义
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve()
      }, 2000)
    })
  })
  .then(function (data) {
    // 之后的 then 的结果是上一个 then 函数的返回值
    // 如果上一个 then 返回的是 Promise 对象，则当前 then 的结果是 Promise 对象的 resolve 的结果
    // console.log(data)
    // return 222
    return new Promise(function (resolve, reject) {
      fs.readFile('./data/b.txt', (err, data) => {
        if (err) {
          throw err
        }
        resolve(data)
      })
    })
  })
  .then(function (data) {
    console.log(data.toString())
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve()
      }, 3000)
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/c.txt', (err, data) => {
        if (err) {
          throw err
        }
        resolve(data)
      })
    })
  })
  .then(data => {
    console.log(data.toString())
  })



// fn(function () {
// })

// fn().then(function () {
// })


