const { Airline, Airport, Route } = require('../models');

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

async function bfs(params) {
  const destination = params.destination.toUpperCase();
  const origin = params.origin.toUpperCase();
  const reverseRouteMap = {};
  const visitedAirports = {};

  let destinationFound = false;
  let airportsToSearchFor = [origin];

  visitedAirports[origin] = true;

  while (airportsToSearchFor.length > 0) {
    const search = airportsToSearchFor.shift();
    const connectedAirports = [];

    let counter = 200;
    const flights = await Route.findAll({
      attributes: ['id', 'distance_kms'],
      include: [
        {
          attributes: ['name', 'two_digit_code', 'three_digit_code'],
          model: Airline
        },
        {
          as: 'originAirport',
          attributes: ['three_letter_code'],
          model: Airport,
          where: {
            three_letter_code: search
          }
        },
        {
          as: 'destinationAirport',
          attributes: ['three_letter_code'],
          model: Airport
        }
      ]
    });

    for (const flight of flights) {
      const thisFlightOrigin = flight.originAirport.three_letter_code;
      const thisFlightDestination = flight.destinationAirport.three_letter_code;

      // console.log(flight.id);
      // console.log(flight.Airline.name);
      // console.log(flight.Airline.two_digit_code);
      // console.log(flight.originAirport.three_letter_code);
      // console.log(flight.destinationAirport.three_letter_code);

      if (!visitedAirports.hasOwnProperty(thisFlightDestination)) {
        // Tracking to build final route
        if (!reverseRouteMap.hasOwnProperty(thisFlightDestination)) {
          reverseRouteMap[thisFlightDestination] = new Set();
        }

        reverseRouteMap[thisFlightDestination].add(thisFlightOrigin);

        visitedAirports[thisFlightDestination] = true;
        connectedAirports.push(thisFlightDestination);
      }

      if (thisFlightDestination === destination) {
        destinationFound = true;
      }

      // console.log('destinationFound', destinationFound);
      // console.log(airportsToSearchFor);
      // console.log('Map', reverseRouteMap);
    }

    // To continue searching
    if (airportsToSearchFor.length === 0 && !destinationFound) {
      airportsToSearchFor.concat(connectedAirports);
    }
  }

  // Found the route
  if (destinationFound) {
    const connections = [];
    connections.push(destination);
    // Build the route backwards
    while (connections[connections.length - 1] !== origin) {
      const places = reverseRouteMap[connections[connections.length - 1]];
      Array.from(places).forEach((place) => {
        connections.push(place);
      });
      connections.push();
    }

    return connections.revrse();
  }

  // console.log('no route');
  return null;
}

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
  bfs,
  generateMapping,
  getShortestPath
};
