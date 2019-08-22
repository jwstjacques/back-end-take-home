'use strict';
module.exports = (sequelize, DataTypes) => {
  const route = sequelize.define('route', {
    name: DataTypes.STRING
  }, {});
  route.associate = function(models) {
    // associations can be defined here
  };
  return route;
};