const Promise = require('bluebird');
const clog = require('fbkt-clog');
const client = require('../../../../db/pgClient');

function executeSql(importSql){
  return client()
    .then(client => {
      return client.query(importSql);
    })
}

module.exports = executeSql;