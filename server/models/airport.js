'use strict';
module.exports = (sequelize, DataTypes) => {
  const airports = sequelize.define('airports', {
    name: DataTypes.STRING
  }, {});
  airports.associate = function(models) {
    // associations can be defined here
  };
  return airports;
};