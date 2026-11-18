// routes/receipt.js  (repeat pattern for sync, receipt, config)
const router = require('express').Router()

router.get('/', (req, res) => res.json({ route: 'receipt', ok: true }))

module.exports = router