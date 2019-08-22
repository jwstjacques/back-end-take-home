'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Cities',
      [
        {
          name: 'Chicago',
          country_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Los Angeles',
          country_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'New York',
          country_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Toronto',
          country_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Vancouver',
          country_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cities', null, {});
  }
};
