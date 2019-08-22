const express = require('express');
const router = express.Router();

const airportsController = require('../../controllers').airports;
const flightsController = require('../../controllers').flights;

/**
 * @api {get} /flights Get a shortest connecting flights route
 * @apiName GetFlights
 * @apiGroup Flights
 *
 * @apiError {json} Error: 'Invalid Origin'
 * @apiError {json} Error: 'Invalid Destination'
 * @apiError {json} Error: 'Destination and Origin cannot be the same'
 *
 * WHEN NO ROUTE EXISTS
 * @apiSuccess (200) {Object} no_results: No Route
 *
 * WHEN A ROUTE EXISTS
 * @apiSuccess (200) {Object} route
 * @apiSuccess (200) {String} route.destination  Capitalized version of query paramater supplied destination
 * @apiSuccess (200) {String} route.origin Capitalized version of query paramater supplied origin
 * @apiSuccess (200) {Array}  route.shortest_path Array of airport objects in order of route
 * @apiSuccess (200) {String} route.shorest_path_string A well formed string of airport codes connected with an '->' ie. 'YYZ -> LAX'
 */
router.get('/', async (req, res) => {
  const errors = {};
  const destination = req.query.destination;
  const origin = req.query.origin;

  // 400 errors for missing query paramter data
  if (!origin) {
    errors.invalid_airport = 'Invalid Origin';
    return res.status(400).json(errors);
  }

  if (!destination) {
    errors.invalid_airport = 'Invalid Destination';
    return res.status(400).json(errors);
  }

  // 422 errors for malformed query parameter data
  if (!origin.match(/^[a-zA-Z]{3}$/i)) {
    errors.invalid_airport = 'Invalid Origin';
  }

  if (!destination.match(/^[a-zA-Z]{3}$/i)) {
    errors.invalid_airport = 'Invalid Destination';
  }

  if (destination && origin && destination === origin) {
    errors.invalid_airport = 'Destination and Origin cannot be the same';
  }

  if (Object.keys(errors).length !== 0) {
    return res.status(422).json(errors);
  }

  // Check to see both airports exist in the database
  const airportExistence = await airportsController.confirmAirportsExist({
    origin,
    destination
  });

  // 1 or both airports do not exist
  if (!!airportExistence.invalid_airport) {
    return res.status(422).json(airportExistence);
  }

  const shortestPath = await flightsController.getShortestPath({
    origin,
    destination
  });

  // A route does not exist
  if (shortestPath === null) {
    return res.status(200).json({ no_route: 'No Route' });
  }

  // Origin and/or Destination airport(s) do not exist
  if (shortestPath.invalid_airport) {
    return res.status(422).json(shortestPath);
  }

  // Create generic string to send to front end
  let shortestPathString = '';
  shortestPath.forEach((airport) => {
    if (!shortestPathString) {
      shortestPathString = airport;
    } else {
      shortestPathString += ` -> ${airport}`;
    }
  });

  await airportsController.getAirportData(shortestPath);

  res.status(200).json({
    destination: destination,
    origin: origin,
    shortest_path: shortestPath,
    shorest_path_string: shortestPathString
  });
});

module.exports = router;
