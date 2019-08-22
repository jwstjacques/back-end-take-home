const { assert } = require('chai');
const flightsController = require('../../controllers').flights;

const CHICAGO = 'ORD';
const LOSA_ANGELES = 'LAX';
const NEW_YORK = 'JFK';
const TORONTO = 'YYZ';
const VANCOUVER = 'YVR';

const INVALID_AIRPORT = 'Destination and Origin cannot be the same';
const INVALID_ORIGIN = 'Invalid Origin';
const INVALID_DESTINATION = 'Invalid Destination';

describe('When calling the Flights Controller', function() {
  describe('When invalid query data is supplied', function() {
    describe('When invalid origin data is supplied', function() {
      it('should return "Invalid Origin" when the airport does not exist', async function() {
        const res = await flightsController.getShortestPath({
          destination: NEW_YORK,
          origin: 'ABCD'
        });
        assert.isObject(res);
        assert(res.invalid_airport, INVALID_ORIGIN);
      });
    });

    describe('When invalid desination data is supplied', function() {
      it('should return "Invalid Destination" when the airport does not exist', async function() {
        const res = await flightsController.getShortestPath({
          origin: NEW_YORK,
          destination: 'ABCD'
        });
        assert.isObject(res);
        assert(res.invalid_airport, INVALID_DESTINATION);
      });
    });

    describe('When the origin and destination are the same', function() {
      it('should return "Destination and Origin cannot be the same" when the airport does not exist', async function() {
        const res = await flightsController.getShortestPath({
          origin: NEW_YORK,
          destination: NEW_YORK
        });
        assert.isObject(res);
        assert(res.invalid_airport, INVALID_AIRPORT);
      });
    });
  });

  describe('When both an origin and a destination are provided as param arguments', function() {
    it('should return an array when both exist', async function() {
      const res = await flightsController.getShortestPath({
        destination: VANCOUVER,
        origin: TORONTO
      });
      assert.isArray(res);
      assert.equal(res.length, 4);
      assert.deepEqual(res, ['YYZ', 'JFK', 'LAX', 'YVR']);
    });

    it('should return null when no route exists to destination', async function() {
      const res = await flightsController.getShortestPath({
        destination: CHICAGO,
        origin: TORONTO
      });
      assert.isNull(res);
    });

    it('should return null when no route exists from origin', async function() {
      const res = await flightsController.getShortestPath({
        destination: TORONTO,
        origin: CHICAGO
      });
      assert.isNull(res);
    });
  });
});
