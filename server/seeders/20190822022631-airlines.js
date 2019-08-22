'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Airlines',
      [
        {
          name: 'Air Canada',
          country_id: 1,
          three_digit_code: 'ACA',
          two_digit_code: 'AC',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'United Airlines',
          country_id: 2,
          three_digit_code: 'UAL',
          two_digit_code: 'UA',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Airlines', null, {});
  }
};
