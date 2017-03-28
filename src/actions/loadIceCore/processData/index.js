const Promise = require('bluebird');
const clog = require('fbkt-clog');

const buildSql = require('./buildSql');
const executeSql = require('./executeSql');

function processData(iceCoreInfo, stagingTable){
  return buildSql(iceCoreInfo, stagingTable)
    .then(importSql => {
      return executeSql(importSql);
    })
    .then(importResult => {
      return { iceCoreProcessingResult: `ICE CORE: ${iceCoreInfo.name}:   imported ${importResult.rowCount} data points` };
    })
    .catch(error => {
      clog.error('ERROR PROCESSING ICE CORE IMPORT DATA', error);
    });
}

module.exports = processData;