const clog = require('fbkt-clog');

const getReadStream = require('./getReadStream');
const createStagingTable = require('./createStagingTable');
const streamToDb = require('./streamToDb');
const processData = require('./processData');
const dropStagingTable = require('./dropStagingTable');

// async function loadIceCore(iceCoreInfo) {
//   const readStream = await getReadStream(iceCoreInfo.filename);
//   return streamToDb({
//     readStream: readStream,
//     iceCoreInfo: iceCoreInfo
//   });
// }


function loadIceCore(iceCoreInfo){
  return getReadStream(iceCoreInfo.filename)
    .then(readStream => {
      const stagingTable = `ice_cores_staging.ice_core_${iceCoreInfo.uploadId.split('-').join('_')}`;
      const fields       = iceCoreInfo.fields;

      return createStagingTable(stagingTable, fields)
        .then(() => {
          return {
            readStream: readStream,
            iceCoreInfo: iceCoreInfo,
            stagingTable: stagingTable,
          };
        });
    })
    .then(workspace => {
      return streamToDb(workspace.stagingTable, workspace.readStream)
        .then(dbTableResult => {
          return Object.assign(workspace, dbTableResult);
        });
    })
    .then(workspace => {
      return processData(workspace.iceCoreInfo, workspace.stagingTable)
        .then(processDataResult => {
          return Object.assign({
            iceCoreInfo: workspace.iceCoreInfo,
            stagingTable: workspace.stagingTable,
          }, processDataResult);
        })
    })
    .then(workspace => {
      return dropStagingTable(workspace.stagingTable)
        .then(() => {
          return workspace;
        })
    })
    .catch(error => {
      clog('ERROR LOADING ICE CORE', error);
      throw error;
    });
}

module.exports = loadIceCore;


