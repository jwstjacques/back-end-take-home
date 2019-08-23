'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Airports', 'Airports_name_key');
    await queryInterface.removeIndex('Airports', ['name']);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Airports', 'name', {
      unique: true
    });
  }
};
