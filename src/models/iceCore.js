"use strict";

module.exports = function (sequelize, DataTypes) {
  const IceCore = sequelize.define("IceCore", {
    name: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    classMethods: {
      underscored: true,
      schema: "ice_cores",
      associate: function (models) {
        IceCore
          .hasMany(models.Series);

        IceCore
          .hasMany(models.Sample)
      }
    }
  });

  return IceCore;
};
