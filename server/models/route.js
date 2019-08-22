'use strict';
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    airline_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    destination_airport_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    distance_kms: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    origin_airport_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  Route.associate = function(models) {
    Route.belongsTo(models.Airline, {
      foreignKey: 'airline_id',
      onDelete: 'CASCADE'
    });
    Route.belongsTo(models.Airport, {
      as: 'destinationAirport',
      foreignKey: 'destination_airport_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    Route.belongsTo(models.Airport, {
      as: 'originAirport',
      foreignKey: 'origin_airport_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Route;
};
