const Promise = require('bluebird');
const clog    = require('fbkt-clog');
const copyFrom = require('pg-copy-streams').from;
const client = require('../../../db/pgClient');

const validateHeaderRow = require('./validateHeaderRow');
const streamDataToTable = require('./streamDataToTable');

function streamToDb(stagingTable, readStream){
  const d = Promise.defer();

  client()
    .then(client => {
      return client.query(copyFrom(`COPY ${stagingTable} FROM STDIN CSV DELIMITER E',' HEADER`));
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