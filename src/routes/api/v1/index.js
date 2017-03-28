const express = require('express');
const router = express.Router();
const iceCoreSummary = require('./ice-core-summary');

router.use('/iceCoreSummary', iceCoreSummary);

module.exports = router;
