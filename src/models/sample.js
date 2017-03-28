"use strict";

module.exports = function (sequelize, DataTypes) {
  const Sample = sequelize.define("Sample", {
    topDepth: DataTypes.FLOAT,
    bottomDepth: DataTypes.FLOAT,
    topAge: DataTypes.FLOAT,
    bottomAge: DataTypes.FLOAT,
  }, {
    underscored: true,
    schema: "ice_cores",
    classMethods: {
      associate: function (models) {
        Sample.hasMany(models.DataPoint)
      }
    }
  });

  return Sample;
};
