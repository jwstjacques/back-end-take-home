const { Airport, City, Country } = require('../models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const confirmAirportsExist = async function(params) {
  const errors = {};

  // Check for missing and malformed data, just to be safe
  if (typeof params !== 'object' || Object.keys(params).length !== 2) {
    errors.invalid_argument =
      'Params must be an object with an "origin" and a "destination"';
    return errors;
  }

  if (!params.origin) {
    errors.invalid_airport = 'Invalid Origin';
  }

  if (!params.destination) {
    errors.invalid_airport = 'Invalid Destination';
  }

  if (
    params.destination &&
    params.origin &&
    params.destination === params.origin
  ) {
    errors.invalid_airport = 'Destination and Origin cannot be the same';
  }

  const destination = params.destination.toUpperCase();
  const origin = params.origin.toUpperCase();

  if (!errors.invalid_airport) {
    const airports = await Airport.findAll({
      attributes: ['name', 'longitude', 'latitude', 'three_letter_code'],
      where: {
        [Op.or]: [
          { three_letter_code: destination },
          { three_letter_code: origin }
        ]
      }
    });

    if (airports.length === 2) {
      const originAirport =
        airports[0].three_letter_code === origin ? airports[0] : airports[1];

      const destinationAirport =
        airports[1].three_letter_code === destination
          ? airports[1]
          : airports[0];

      return {
        destination: destinationAirport,
        origin: originAirport
      };
    } else if (airports.length === 1) {
      errors.invalid_airport =
        airports[0].three_letter_code === origin
          ? 'Invalid Destination'
          : 'Invalid Origin';
    } else {
      errors.invalid_airport = 'Neither Airport Exists';
    }
  }

  return errors;
};

const getAirportData = async function(airports) {
  const airportData = await Airport.findAll({
    attributes: ['id', 'latitude', 'longitude', 'name', 'three_letter_code'],
    include: [
      {
        attributes: ['name'],
        include: [
          {
            attributes: ['name'],
            model: Country
          }
        ],
        model: City
      }
    ],
    where: {
      three_letter_code: airports
    }
  });

  airportData.forEach((airport) => {
    const index = airports.indexOf(airport.three_letter_code);
    airports[index] = airport;
  });
};

module.exports = {
  confirmAirportsExist,
  getAirportData
};
