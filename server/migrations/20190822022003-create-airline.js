'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Airlines',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          country_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
          },
          three_digit_code: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
          },
          two_digit_code: {
            allowNull: false,
            type: Sequelize.STRING,
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
      await queryInterface.dropTable('Airlines');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
