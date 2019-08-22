'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    'City',
    {
      country_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
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
  City.associate = function(models) {
    City.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE'
    });
  };
  return City;
};
