const csv = require('csv-parser');
const fs = require('fs');
const { Airline, Airport, City, Country, Route } = require('../server/models');

const { addCountries, getCountries } = require('./helpers');

const path = './data/full/airlines.csv';
const results = [];

async function add() {
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      console.log('Start Adding Airlines');
      console.log('1: add countries in airlines');
      await addCountries(results);
      console.log('2: get countries in airlines');
      const countries = await getCountries();
      console.log('3', results.length);
      console.log('4', countries);
      console.log('End Adding Airlines');
    });
}

module.exports = {
  add
};
