'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Routes',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          airline_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          destination_airport_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          distance_kms: {
            allowNull: false,
            type: Sequelize.FLOAT
          },
          origin_airport_id: {
            allowNull: false,
            type: Sequelize.INTEGER
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
      await queryInterface.dropTable('Routes');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
