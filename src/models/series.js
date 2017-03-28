"use strict";

module.exports = function (sequelize, DataTypes) {
  const Series = sequelize.define("Series", {
    name: DataTypes.STRING,
  }, {
    underscored: true,
    schema: "ice_cores",
    classMethods: {
      associate: function (models) {
        Series
          .hasOne(models.DataPointType);

        Series
          .hasMany(models.DataPoint)
      }
    }
  });

  return Series;
};
