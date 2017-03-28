const express = require('express');
const router = express.Router();
const iceCores = require('./ice-cores');

router.use('/iceCores', iceCores);

module.exports = router;
