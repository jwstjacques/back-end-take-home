const { Airport, Route } = require('../models');

let mapping = {};
let routingMatrix = {};

/*
 * Assign a key value pair of airport code and index to mapping global variable
 */
const generateMapping = async function() {
  const airports = await Airport.findAll({
    attributes: ['three_letter_code']
  });
  airports.forEach((airport, index) => {
    mapping[airport.three_letter_code] = index;
  });
};

/*
 * Generate a 2D matrix representing whether an airport connects to another airport, filled with zeroes to start
 */
const generateGraph = async function() {
  await generateMapping();
  const length = Object.keys(mapping).length;
  routingMatrix = Array(length);

  for (var i = 0; i < length; ++i) {
    routingMatrix[i] = Array(length).fill(0);
  }

  const routes = await Route.findAll({
    attributes: ['id'],
    include: [
      {
        as: 'originAirport',
        attributes: ['three_letter_code'],
        model: Airport
      },
      {
        as: 'destinationAirport',
        attributes: ['three_letter_code'],
        model: Airport
      }
    ]
  });

  routes.forEach((route) => {
    const originIndex = mapping[route.originAirport.three_letter_code];
    const destinationIndex =
      mapping[route.destinationAirport.three_letter_code];
    routingMatrix[originIndex][destinationIndex] = 1;
  });
};

/*
 *  Generate an array of the shortest path between an origin and a destination airport
 *
 *  @param {object} params
 *  @param {string} params.destination Three letter code for destination airport
 *  @param {string} params.origin Three letter code for origin airport
 *
 *  ERROR
 *  @return {object} invalid_airport 'Invalid Origin'
 *  @return {object} invalid_airport 'Invalid Detination'
 *  @return {object} invalid_airport 'Destination and Origin cannot be the same'
 *
 *  SUCCESS
 *  @return {array} An array of airport 3-letter codes, in order from origin to destination
 */
const getShortestPath = async function(params) {
  const connectionParent = {};
  const destination = params.destination.toUpperCase();
  const errors = {};
  const finalPath = [];
  const origin = params.origin.toUpperCase();
  const queue = [origin];
  const visited = {};

  let connected = [];
  let current = queue.shift();
  let foundDestination = false;

  connectionParent[origin] = null;

  await generateGraph();

  if (!mapping.hasOwnProperty(origin)) {
    errors.invalid_airport = 'Invalid Origin';
    return errors;
  }

  if (!mapping.hasOwnProperty(destination)) {
    errors.invalid_airport = 'Invalid Detination';
    return errors;
  }

  if (destination === origin) {
    errors.invalid_airport = 'Destination and Origin cannot be the same';
    return errors;
  }

  while ((connected = getConnectedAirports(current)) !== null) {
    for (let i = 0; i < connected.length; ++i) {
      // Leave when destination is found
      if (connected[i] === destination) {
        foundDestination = true;
        connectionParent[connected[i]] = current;
        break;
      }

      if (!visited[connected[i]]) {
        visited[connected[i]] = true;
        queue.push(connected[i]);
        connectionParent[connected[i]] = current;
      }
    }

    if (queue.length == 0) {
      break;
    }

    current = queue.shift();
  }

  if (!foundDestination) {
    return null;
  }

  // Construct the final route
  current = destination;
  finalPath.push(destination);

  while (connectionParent[current] != origin) {
    finalPath.push(connectionParent[current]);
    current = connectionParent[current];
  }

  finalPath.push(origin);
  return finalPath.reverse();
};

/*
 * Get all airports that have a connecting flight to them, from a destination airport, to update routingMatrix
 */
const getConnectedAirports = function(current) {
  const currentIndex = mapping[current];
  const result = [];

  for (let i = 0; i < routingMatrix[currentIndex].length; ++i) {
    if (routingMatrix[currentIndex][i] === 1) {
      result.push(Object.keys(mapping)[i]);
    }
  }
  return result;
};

module.exports = {
  generateMapping,
  getShortestPath
};
