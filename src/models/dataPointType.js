"use strict";

module.exports = function (sequelize, DataTypes) {
  const DataPointType = sequelize.define("DataPointType", {
    name: DataTypes.STRING,
  }, {
    underscored: true,
    schema: "ice_cores",
    classMethods: {
      associate: function (models) {
      }
    }
  });

  return DataPointType;
};
