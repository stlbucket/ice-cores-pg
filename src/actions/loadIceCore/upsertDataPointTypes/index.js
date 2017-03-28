const Promise   = require('bluebird');
const clog      = require('fbkt-clog');

function createDataPointTypes(iceCoreJson) {
  const filterFields = [ 'TopDepth', 'BottomDepth', 'TopAge', 'BottomAge' ];
  const dataPointTypeNames = Object.keys(iceCoreJson[0]).filter(field => filterFields.indexOf(field) === -1);

  return Promise.map(
    dataPointTypeNames,
    dataPointTypeName => {
      // return dataPointTypeQL.upsert({
      //   name: dataPointTypeName
      // })
    }
  );
}

module.exports = createDataPointTypes;