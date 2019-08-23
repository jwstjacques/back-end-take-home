const csv = require('csv-parser');
const fs = require('fs');
const { Route } = require('../server/models');

const { getAirlines, getAirports } = require('./helpers');

const path = './data/full/routes.csv';
const results = [];

async function add() {
  let promise = new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log('----Start Adding Routes----');
        const airports = await getAirports();
        const airlines = await getAirlines();
        console.log(airports);
        const inserts = results.map((row) => {
          // console.log(airports[row.Destination]);
          return {
            airline_id: airlines[row['Airline Id']],
            destination_airport_id: airports[row.Destination],
            origin_airport_id: airports[row.Destination],
            distance_kms: 0
          };
        });
        console.log('Inserting routes');
        await Route.bulkCreate(inserts);
        console.log('End Adding Routes');
        resolve();
      });
  });

  return promise;
}

module.exports = {
  add
};
