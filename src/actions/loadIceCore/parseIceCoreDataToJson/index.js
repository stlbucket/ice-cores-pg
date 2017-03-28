const csvParser = require('csv').parse;
const Promise   = require('bluebird');
const clog      = require('fbkt-clog');

function parseIceCoreDataToJson(readStream) {
  const d = Promise.defer();

  const parser = csvParser({delimiter: ',', columns: true}, function (err, data) {
    d.resolve(data);
  });

  readStream.pipe(parser);

  return d.promise;
}

module.exports = parseIceCoreDataToJson;