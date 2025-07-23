// routes/health.js
const router = require('express').Router();
router.get('/', (_, res) => res.json({ status: 'ok' }));
module.exports = router;