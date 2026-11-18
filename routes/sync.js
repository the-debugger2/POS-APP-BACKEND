// routes/sync.js  (repeat pattern for sync, receipt, config)
const router = require('express').Router()

router.get('/', (req, res) => res.json({ route: 'sync', ok: true }))

module.exports = router