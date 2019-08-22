const app = require('../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert, expect } = chai;
chai.use(chaiHttp);

const CHICAGO = 'ORD';
const LOSA_ANGELES = 'LAX';
const NEW_YORK = 'JFK';
const TORONTO = 'YYZ';
const VANCOUVER = 'YVR';

const INVALID_AIRPORT = 'Destination and Origin cannot be the same';
const INVALID_ORIGIN = 'Invalid Origin';
const INVALID_DESTINATION = 'Invalid Destination';
const NO_ROUTE = 'No Route';

const invalidAirport1 = 'XXX';
const invalidAirport2 = 'XXZ';

flightRoute = async (data) => {
  return chai
    .request(app)
    .get('/api/flights')
    .query(data);
};

const validate400 = (res, type) => {
  assert.equal(res.status, 400);
  validateBody(res, type);
};

const validate422 = (res, type) => {
  assert.equal(res.status, 422);
  validateBody(res, type);
};

const validateBody = (res, type) => {
  assert.isObject(res.body);
  assert.equal(Object.keys(res.body).length, 1);
  let error;
  if (type === 'destination') {
    error = INVALID_DESTINATION;
  } else if (type === 'origin') {
    error = INVALID_ORIGIN;
  } else {
    error = INVALID_AIRPORT;
  }
  assert.equal(res.body.invalid_airport, error);
};

describe('When calling the GET flights route', function() {
  describe('When valid query data is supplied', function() {
    describe('When both airports exist and have a connecting path', function() {
      it('should return a 200 and an array of airport objects', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: TORONTO
        });
        assert.equal(res.status, 200);
        assert.equal(res.body.destination, NEW_YORK);
        assert.equal(res.body.origin, TORONTO);
        assert.isArray(res.body.shortest_path);
        assert.equal(res.body.shortest_path.length, 2);
        assert.equal(res.body.shortest_path[0].three_letter_code, TORONTO);
        assert.equal(res.body.shortest_path[1].three_letter_code, NEW_YORK);
      });
    });

    describe('When both airports exist and are lowercase and have a connecting path', function() {
      it('should return a 200 and an array of airport objects', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: TORONTO
        });
        assert.equal(res.status, 200);
        assert.equal(
          res.body.destination.toLowerCase(),
          NEW_YORK.toLowerCase()
        );
        assert.equal(res.body.origin.toLowerCase(), TORONTO.toLowerCase());
        assert.isArray(res.body.shortest_path);
        assert.equal(res.body.shortest_path.length, 2);
        assert.equal(
          res.body.shortest_path[0].three_letter_code.toLowerCase(),
          TORONTO.toLowerCase()
        );
        assert.equal(
          res.body.shortest_path[1].three_letter_code.toLowerCase(),
          NEW_YORK.toLowerCase()
        );
      });
    });

    describe('When both airports exist and but one does not have a connecting path', function() {
      it('should return a 200 and "No Route" when there is no connection from destination', async function() {
        const res = await flightRoute({
          destination: CHICAGO,
          origin: TORONTO
        });
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(Object.keys(res.body).length, 1);
        assert.equal(res.body.no_route, NO_ROUTE);
      });

      it('should return a 200 and "No Route" when there is no connection from origin', async function() {
        const res = await flightRoute({
          destination: TORONTO,
          origin: CHICAGO
        });
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(Object.keys(res.body).length, 1);
        assert.equal(res.body.no_route, NO_ROUTE);
      });
    });
  });

  describe('When invalid query data is supplied', function() {
    describe('When invalid origin data is supplied', function() {
      it('should return a 422 and the message "Invalid Origin" when the argument is longer than 3 characters', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: 'ABCD'
        });
        validate422(res, 'origin');
      });

      it('should return a 422 and the message "Invalid Origin" when the argument is less than 3 characters', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: 'AB'
        });
        validate422(res, 'origin');
      });

      it('should return a 422 and the message "Invalid Origin" when the argument has a number in it', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: 'A1B'
        });
        validate422(res, 'origin');
      });

      it('should return a 400 and the message "Invalid Origin" when the argument has a non-alphabetical character in it', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: 'A_B'
        });
        validate422(res, 'origin');
      });

      it('should return a 400 and the message "Invalid Origin" when the argument is empty string', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: ''
        });
        validate400(res, 'origin');
      });
    });

    describe('When invalid destination data is supplied', function() {
      it('should return a 422 and the message "Invalid Destination" when the argument is longer than 3 characters', async function() {
        const res = await flightRoute({
          origin: NEW_YORK,
          destination: 'ABCD'
        });
        validate422(res, 'destination');
      });

      it('should return a 422 and the message "Invalid Destination" when the argument is less than 3 characters', async function() {
        const res = await flightRoute({
          origin: NEW_YORK,
          destination: 'AB'
        });
        validate422(res, 'destination');
      });

      it('should return a 422 and the message "Invalid Destination" when the argument has a number in it', async function() {
        const res = await flightRoute({
          origin: NEW_YORK,
          destination: 'A1B'
        });
        validate422(res, 'destination');
      });

      it('should return a 400 and the message "Invalid Destination" when the argument has a non-alphabetical character in it', async function() {
        const res = await flightRoute({
          origin: NEW_YORK,
          destination: 'A_B'
        });
        validate422(res, 'destination');
      });

      it('should return a 400 and the message "Invalid Destination" when the argument is empty string', async function() {
        const res = await flightRoute({
          origin: NEW_YORK,
          destination: ''
        });
        validate400(res, 'destination');
      });
    });

    describe('When no origin data is supplied', function() {
      it('should return a 400 and the message "Invalid Origin" when the argument is empty string', async function() {
        const res = await flightRoute({
          destination: NEW_YORK
        });
        validate400(res, 'origin');
      });
    });

    describe('When no desination data is supplied', function() {
      it('should return a 400 and the message "Invalid Destination" when the argument is empty string', async function() {
        const res = await flightRoute({
          origin: NEW_YORK
        });
        validate400(res, 'destination');
      });
    });

    describe('When the origin and destination are the same', function() {
      it('should return a 422 and the message Destination and Origin cannot be the same" when the argument is empty string', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: NEW_YORK
        });
        validate422(res, 'same');
      });
    });

    describe('When an aiport does not exist', function() {
      it('should return a 422 and the message "Invalid Origin" when the origin does not exist', async function() {
        const res = await flightRoute({
          destination: NEW_YORK,
          origin: invalidAirport1
        });
        validate422(res, 'origin');
      });

      it('should return a 422 and the message "Invalid Origin" when the origin does not exist', async function() {
        const res = await flightRoute({
          destination: invalidAirport1,
          origin: NEW_YORK
        });
        validate422(res, 'destination');
      });
    });
  });
});
