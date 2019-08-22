const { assert, expect } = require('chai');
const airportsController = require('../../controllers').airports;

const invalid_airport1 = 'XXX';
const invalid_airport2 = 'XXZ';
const destination = 'YYZ';
const origin = 'JFK';

describe('When calling the Airport Controller', function() {
  describe('When both an origin and a destination are provided as param arguments', function() {
    it('should return true when both exist', async function() {
      const res = await airportsController.confirmAirportsExist({
        destination,
        origin
      });
      assert.isObject(res);
      assert.equal(Object.keys(res).length, 2);
      assert.equal(res.origin.three_letter_code, 'JFK');
      assert.equal(res.origin.name, 'John F Kennedy International Airport');
      assert.equal(res.origin.longitude, -73.77890015);
      assert.equal(res.origin.latitude, 40.63980103);
      assert.equal(res.destination.three_letter_code, 'YYZ');
      assert.equal(
        res.destination.name,
        'Lester B. Pearson International Airport'
      );
      assert.equal(res.destination.longitude, -79.63059998);
      assert.equal(res.destination.latitude, 43.67720032);
    });

    it('should return "Invalid Destination" when the destination airport does not exist', async function() {
      const res = await airportsController.confirmAirportsExist({
        destination: invalid_airport1,
        origin
      });

      assert.strictEqual(
        res.invalid_airport,
        'Invalid Destination',
        'error message'
      );
    });

    it('should return "Invalid Origin" when the origin airport does not exist', async function() {
      const res = await airportsController.confirmAirportsExist({
        destination,
        origin: invalid_airport1
      });
      assert.strictEqual(
        res.invalid_airport,
        'Invalid Origin',
        'error message'
      );
    });

    it('should return "Neither Airport Exists" when neither airport exists', async function() {
      const res = await airportsController.confirmAirportsExist({
        destination: invalid_airport1,
        origin: invalid_airport2
      });
      assert.strictEqual(
        res.invalid_airport,
        'Neither Airport Exists',
        'error message'
      );
    });

    it('should return "Destination and Origin cannot be the same" when the origin and destination are the same airport', async function() {
      const res = await airportsController.confirmAirportsExist({
        destination: origin,
        origin
      });
      assert.strictEqual(
        res.invalid_airport,
        'Destination and Origin cannot be the same',
        'error message'
      );
    });
  });

  describe('When param argument is not properly formed', function() {
    describe('should return "Params must be an object with an "origin" and a "destination"', function() {
      it('when object is empty', async function() {
        const res = await airportsController.confirmAirportsExist({});
        assert.strictEqual(
          res.invalid_argument,
          'Params must be an object with an "origin" and a "destination"',
          'error message'
        );
      });

      it('when params is not an object', async function() {
        const res = await airportsController.confirmAirportsExist(
          origin,
          destination
        );
        assert.strictEqual(
          res.invalid_argument,
          'Params must be an object with an "origin" and a "destination"',
          'error message'
        );
      });

      it('When origin airport is not included as a param argument', async function() {
        const res = await airportsController.confirmAirportsExist({
          destination
        });
        assert.strictEqual(
          res.invalid_argument,
          'Params must be an object with an "origin" and a "destination"',
          'error message'
        );
      });

      it('When destination airport is not included as a param argument', async function() {
        const res = await airportsController.confirmAirportsExist({
          origin
        });
        assert.strictEqual(
          res.invalid_argument,
          'Params must be an object with an "origin" and a "destination"',
          'error message'
        );
      });
    });
  });
});
