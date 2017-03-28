const clog = require('fbkt-clog');
const Promise = require('bluebird');

function parseIceCoreToFinalJson(workspace) {
  const filterFields = ['TopDepth', 'BottomDepth', 'TopAge', 'BottomAge'];

  const iceCoreWithSamples = {
    name: workspace.iceCoreInfo.name,
    samples: workspace.iceCoreSamples.map(
      sample => {
        return {
          topDepth: sample.TopDepth,
          bottomDepth: sample.BottomDepth,
          topAge: sample.TopAge,
          bottomAge: sample.BottomAge,
          dataPoints: Object.keys(sample).filter(key => filterFields.indexOf(key) === -1).map(
            (key) => {
              return {
                value:  sample[key],
                dataPointTypeId:  workspace.dataPointTypes.find(type => type.name === key).id,
                seriesId: workspace.serieses.find(series => series.name === key ).id
              }
            }
          )
        }
      }
    )
  };
  return Promise.resolve(iceCoreWithSamples);
}

module.exports = parseIceCoreToFinalJson;