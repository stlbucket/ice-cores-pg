"use strict";

module.exports = function (sequelize, DataTypes) {
  const DataPoint = sequelize.define("DataPoint", {
    name: DataTypes.STRING,
  }, {
    classMethods: {
      underscored: true,
      schema: "ice_cores",
      associate: function (models) {
        DataPoint.hasOne(models.DataPointType)
      }
    }
  });

  return DataPoint;
};
