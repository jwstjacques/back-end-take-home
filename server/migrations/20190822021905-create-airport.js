'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Airports',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          city_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          latitude: {
            allowNull: false,
            type: Sequelize.FLOAT
          },
          longitude: {
            allowNull: false,
            type: Sequelize.FLOAT
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
          },
          three_letter_code: {
            allowNull: false,
            type: Sequelize.STRING(3),
            unique: true
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        },
        {
          transaction
        }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('Airports');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
