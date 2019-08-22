'use strict';
module.exports = (sequelize, DataTypes) => {
  const Airline = sequelize.define(
    'Airline',
    {
      country_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      three_digit_code: {
        allowNull: false,
        type: DataTypes.STRING(3)
      },
      two_digit_code: {
        allowNull: false,
        type: DataTypes.STRING(2)
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name']
        },
        {
          unique: true,
          fields: ['three_digit_code']
        },
        {
          unique: true,
          fields: ['two_digit_code']
        }
      ]
    }
  );
  Airline.associate = function(models) {
    Airline.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE'
    });
    Airline.hasMany(models.Route, {
      as: 'airlineRoutes',
      foreignKey: 'airline_id'
    });
  };
  return Airline;
};
