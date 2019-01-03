const crypto = require('crypto')

// const hashes = crypto.getHashes()
// console.log(hashes)

module.exports = str => {
  // 1. 基于一个加密算法创建一个加密对象
  const hash = crypto.createHash('md5')

  // 2. 对指定的字符串进行加密
  hash.update(str)

  // 3. 以 16 进制的数据格式获取加密结果
  return hash.digest('hex')
}
