const Promise = require('bluebird');
const clog = require('fbkt-clog');

const getReadStream = require('./getReadStream');
const streamToDb = require('./streamToDb');
// const parseIceCoreDataToJson = require('./parseIceCoreDataToJson');
// const upsertDataPointTypes = require('./upsertDataPointTypes');
// const createSerieses = require('./createSerieses');
// const parseIceCoreToFinalJson = require('./parseIceCoreToFinalJson');
// const buildMutation = require('./buildMutation');
// const associateSerieses = require('./associateSerieses');

function loadIceCore(iceCoreInfo){
  return getReadStream(iceCoreInfo.filename)
    .then(readStream => {
      const workspace = {
        readStream: readStream,
        iceCoreInfo: iceCoreInfo
      };

      return streamToDb(workspace)
        .then(dbTableResult => {
          console.log('res', dbTableResult);

          return Object.assign(workspace, {
            createDbTableResult: dbTableResult
          });
        });
    })
      // .then(workspace => {
      // return parseIceCoreDataToJson(readStream);
    // })
    // .then(iceCoreSamples => {
    //   return upsertDataPointTypes(iceCoreSamples)
    //     .then(dataPointTypes => {
    //       return {
    //         iceCoreInfo:  iceCoreInfo,
    //         iceCoreSamples: iceCoreSamples,
    //         dataPointTypes: dataPointTypes
    //       };
    //     })
    // })
    // .then(workspace => {
    //   return createSerieses(workspace.dataPointTypes)
    //     .then(serieses => {
    //       return Object.assign(workspace, {
    //         serieses: serieses
    //       })
    //     });
    // })
    // .then(workspace => {
    //   return parseIceCoreToFinalJson(workspace)
    //     .then(finalIceCoreJson => {
    //       return Object.assign(workspace, {
    //         finalIceCoreJson: finalIceCoreJson
    //       })
    //     });
    // })
    // .then(workspace => {
    //   return buildMutation(workspace.finalIceCoreJson)
    //     .then(mutation => {
    //       return Object.assign(workspace, {
    //         mutation: mutation
    //       });
    //     });
    // })
    // .then(workspace => {
    //   return client.mutate(workspace.mutation)
    //     .then(iceCoreQL => {
    //       return Object.assign(workspace, {
    //         iceCoreQL: iceCoreQL.createIceCore
    //       })
    //     })
    // })
    // .then(workspace => {
    //   return associateSerieses(workspace)
    //     .then(seriesAssociations => {
    //       return Object.assign(workspace, {
    //         seriesAssociations: seriesAssociations
    //       })
    //     })
    // })
    .catch(error => {
      clog('ERROR LOADING ICE CORE', error);
      throw error;
    });
}

module.exports = loadIceCore;


