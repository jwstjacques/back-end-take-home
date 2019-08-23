'use strict';
module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define(
    'Airport',
    {
      city_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      latitude: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      longitude: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      three_letter_code: {
        allowNull: false,
        type: DataTypes.STRING(3)
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['three_letter_code']
        }
      ]
    }
  );
  Airport.associate = function(models) {
    Airport.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE'
    });
    Airport.hasMany(models.Route, {
      as: 'destinationAirports',
      foreignKey: 'destination_airport_id'
    });
    Airport.hasMany(models.Route, {
      as: 'originAirports',
      foreignKey: 'origin_airport_id'
    });
  };
  return Airport;
};
