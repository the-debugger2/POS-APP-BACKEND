// routes/config.js  (repeat pattern for sync, receipt, config)
const router = require('express').Router()

router.get('/', (req, res) => res.json({ route: 'config', ok: true }))

module.exports = router