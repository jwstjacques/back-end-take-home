'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Cities', 'Cities_name_key');
    await queryInterface.removeIndex('Cities', ['name']);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Cities', 'name', {
      unique: true
    });
  }
};
