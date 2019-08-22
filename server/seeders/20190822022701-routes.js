'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Routes',
      [
        {
          airline_id: 1,
          distance_kms: 588.6,
          destination_airport_id: 3,
          origin_airport_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          airline_id: 1,
          distance_kms: 588.6,
          destination_airport_id: 4,
          origin_airport_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          airline_id: 1,
          distance_kms: 1741,
          destination_airport_id: 5,
          origin_airport_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          airline_id: 1,
          distance_kms: 1741,
          destination_airport_id: 2,
          origin_airport_id: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          airline_id: 2,
          distance_kms: 3974,
          destination_airport_id: 3,
          origin_airport_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          airline_id: 2,
          distance_kms: 3974,
          destination_airport_id: 2,
          origin_airport_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Routes', null, {});
  }
};
