const express = require('express');
const router = express.Router();

const pgClient = require('../../../../db/pgClient');

/* GET users listing. */
router.get('/', function(req, res, next) {
  pgClient()
    .then(client => {
      console.log('BOOM');
      return client.query('SELECT * FROM ice_cores.ice_core_summary_view');
    })
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      res.send(error);
    })
});

module.exports = router;
