const express = require('express')

const router = express.Router()

// router.prefix = '/abc'

router.get('/foo', (req, res) => res.send('bar'))

module.exports = router
