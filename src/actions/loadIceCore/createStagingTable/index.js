const Promise = require('bluebird');
const _ = require('lodash');
const clog = require('fbkt-clog');
const sequelize = require('../../../db/client');

function createStagingTable(tableName, fields){
  return Promise.resolve(buildScript(tableName, fields))
    .then(script => {
      return executeScript(script);
    })
    .catch(error => {
      clog('ERROR CREATING IMPORT TABLE', error);
      throw error;
    })
}

function executeScript(script){
  return sequelize().query(script)
}

function buildScript(tableName, fields){

  return `
CREATE TABLE ${tableName} (${
  fields.map(
    field => {
      return `\n  ${_.snakeCase(field)} text NULL`
      // return `\n  "${field}" text NULL`
    }
  )
}
);
  `;
}

module.exports = createStagingTable;