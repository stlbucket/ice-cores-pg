const clog = require('fbkt-clog');
const uuid = require('uuid');
const loadIceCore = require('../../src/actions/loadIceCore');

// const filename = './testCores/GreenlandIceCoreData_490.csv';
const filename = './testCores/GreenlandIceCoreData.csv';
// const filename = './testCores/GISP2.csv';
const iceCoreInfo = {
  // name: 'GISP2',
  name: uuid.v4(),
  uploadId: uuid.v4(),
  filename: filename,
  fields: [ "TopDepth", "BottomDepth", "NO3_ppb", "NO3_uM", "TopAge"," BottomAge" ],
  dataPointTypes: ["NO3_ppb", "NO3_uM" ]
};

loadIceCore(iceCoreInfo)
  .then(result => {
    clog('RESULT', result);
    process.exit();
  })
  .catch(error => {
    clog.error('ERROR', error);
    process.exit();
  });
