'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Countries',
      [
        {
          name: 'Canada',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'United States',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Countries', null, {});
  }
};
