const Promise = require('bluebird');
const clog    = require('fbkt-clog');
const Transform = require('stream').Transform;
const copyFrom = require('pg-copy-streams').from;
const client = require('../../../db/pgClient');

const validateHeaderRow = require('./validateHeaderRow');
const createTargetTable = require('./createTargetTable');
const streamDataToTable = require('./streamDataToTable');

function streamToDb(workspace){
  const tableName = `ice_cores_staging.ice_core_${workspace.iceCoreInfo.uploadId.split('-').join('_')}`;
  const fields = workspace.iceCoreInfo.fields;

  const d = Promise.defer();


  // workspace.readStream.on('end', function(){
  //   d.resolve();
  // });

  client()
    .then(client => {
      return createTargetTable(tableName, fields)
        .then(createTargetTableResult => {
           clog('TARGET TABLE', createTargetTableResult);
          return client;
        });
    })
    .then(client => {
      return client.query(copyFrom(`COPY ${tableName} FROM STDIN CSV DELIMITER E',' HEADER`));
    })
    .then(copyFromStream => {
      clog('heyo', copyFromStream);

      copyFromStream.on('end', function () {
        d.resolve();
      });

      workspace.readStream
        .pipe(copyFromStream);
    });

  return d.promise;
}

module.exports = streamToDb;