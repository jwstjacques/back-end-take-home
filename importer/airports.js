const csv = require('csv-parser');
const fs = require('fs');
const { Airline, Airport, City, Country, Route } = require('../server/models');

const { addCountries, getCountries } = require('./helpers');

const path = './data/full/airports.csv';
const results = [];

async function add() {
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      console.log('Start Adding Airports');
      console.log('5: add countries in aiprorts');
      await addCountries(results);
      console.log('6: get countries in aiprorts');
      const countries = await getCountries();
      console.log('End Adding Airports');
    });
}

module.exports = {
  add
};
