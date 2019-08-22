'use strict';
module.exports = (sequelize, DataTypes) => {
  const airline = sequelize.define('airline', {
    name: DataTypes.STRING
  }, {});
  airline.associate = function(models) {
    // associations can be defined here
  };
  return airline;
};