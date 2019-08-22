'use strict';
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    'Country',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name']
        }
      ]
    }
  );
  Country.associate = function(models) {
    Country.hasMany(models.Airline, {
      as: 'airlines',
      foreignKey: 'country_id'
    });
    Country.hasMany(models.City, {
      as: 'cities',
      foreignKey: 'country_id'
    });
  };
  return Country;
};
