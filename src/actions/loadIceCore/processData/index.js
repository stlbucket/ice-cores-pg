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
      clog('IMPORT RESULT', importResult);
      return importResult;
    });
}

module.exports = processData;