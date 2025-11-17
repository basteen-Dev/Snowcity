// routes/webhooks.routes.js
const express = require('express');
const router = express.Router();
const payphiReturn = require('../webhooks/payphi.return');

// Accept both POST (server-to-server) and GET (user redirect)
// Use urlencoded parser for POST signatures
router.post('/payphi/return', express.urlencoded({ extended: false }), payphiReturn);
router.get('/payphi/return', payphiReturn);

module.exports = router;