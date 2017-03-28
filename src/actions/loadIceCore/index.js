const clog = require('fbkt-clog');

const getReadStream = require('./getReadStream');
const streamToDb = require('./streamToDb');
const processData = require('./processData');

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
      const workspace = {
        iceCoreInfo: iceCoreInfo
      };

      return streamToDb(iceCoreInfo, readStream)
        .then(dbTableResult => {
          return Object.assign(workspace, dbTableResult);
        });
    })
    .then(workspace => {
      return processData(workspace.iceCoreInfo, workspace.stagingTable)
        .then(processDataResult => {
          return Object.assign(workspace, processDataResult);
        })
    })
    .catch(error => {
      clog('ERROR LOADING ICE CORE', error);
      throw error;
    });
}

module.exports = loadIceCore;


