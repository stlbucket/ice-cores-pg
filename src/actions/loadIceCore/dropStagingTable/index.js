const client = require('../../../db/pgClient');

function dropStagingTable(stagingTable){
  const sql = `DROP TABLE IF EXISTS ${stagingTable}`;

  return client()
    .then(client => {
      return client.query(sql);
    });
}

module.exports = dropStagingTable;