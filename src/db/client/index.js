const Sequelize = require('sequelize');
const config = require('../../../config/config.json');

let _sequelize = null;

function getClient(){
  if (_sequelize === null) {
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];

    if (!dbConfig) { throw new Error(`NO DB CONFIG FOR ENVIRONMENT: ${env}`)}
    _sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.dialect
    })
  }
  return _sequelize;
}

module.exports = getClient;