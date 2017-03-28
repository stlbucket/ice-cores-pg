const Promise = require('bluebird');
const Client = require('pg').Client;
const config = require('../../../config/config.json');


function getClient(){
  const d = Promise.defer();

  console.log(config.development);
// connect to our database
  const client = new Client({
    user: config.development.username,
    database: config.development.database,
    password: config.development.password
  });

  client.connect(function (err, client) {
    console.log('BOOYA', err, client);
    if (err) d.reject(err);

    d.resolve(client);
  });

  return d.promise;
}

module.exports = getClient;