'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Airports',
      [
        {
          name: "Chicago O'Hare International Airport",
          city_id: 1,
          three_letter_code: 'ORD',
          longitude: -87.90480042,
          latitude: 41.97859955,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Los Angeles International Airport',
          city_id: 2,
          three_letter_code: 'LAX',
          longitude: -118.4079971,
          latitude: 33.94250107,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'John F Kennedy International Airport',
          city_id: 3,
          three_letter_code: 'JFK',
          longitude: -73.77890015,
          latitude: 40.63980103,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Lester B. Pearson International Airport',
          city_id: 4,
          three_letter_code: 'YYZ',
          longitude: -79.63059998,
          latitude: 43.67720032,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Vancouver International Airport',
          city_id: 5,
          three_letter_code: 'YVR',
          longitude: -123.1839981,
          latitude: 49.19390106,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Airports', null, {});
  }
};
