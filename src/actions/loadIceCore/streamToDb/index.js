const Promise = require('bluebird');
const clog    = require('fbkt-clog');
const copyFrom = require('pg-copy-streams').from;
const client = require('../../../db/pgClient');

const validateHeaderRow = require('./validateHeaderRow');
const createTargetTable = require('./createTargetTable');
const streamDataToTable = require('./streamDataToTable');

function streamToDb(iceCoreInfo, readStream){
  const stagingTable = `ice_cores_staging.ice_core_${iceCoreInfo.uploadId.split('-').join('_')}`;
  const fields = iceCoreInfo.fields;

  const d = Promise.defer();

  client()
    .then(client => {
      return createTargetTable(stagingTable, fields)
        .then(createTargetTableResult => {
          return client.query(copyFrom(`COPY ${stagingTable} FROM STDIN CSV DELIMITER E',' HEADER`));
        })
    })
    .then(copyFromStream => {

      copyFromStream.on('end', function () {
        d.resolve({
          stagingTable:  stagingTable
        });
      });

      readStream
        .pipe(copyFromStream);
    });

  return d.promise;
}

module.exports = streamToDb;