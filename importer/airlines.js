const csv = require('csv-parser');
const fs = require('fs');
const { Airline } = require('../server/models');

const { addCountries, getCountries } = require('./helpers');

const path = './data/full/airlines.csv';
const results = [];

async function add() {
  let promise = new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log('----Start Adding Airlines----');
        console.log('Inserting Countries');
        await addCountries(results);
        const countries = await getCountries();
        const inserts = results.map((row) => {
          return {
            country_id: countries[row.Country],
            name: row.Name,
            three_digit_code: row['3 Digit Code'],
            two_digit_code: row['2 Digit Code']
          };
        });
        console.log('Inserting Airlines');
        Airline.bulkCreate(inserts);
        console.log('End Adding Airlines');
        resolve();
      });
  });

  return promise;
}

module.exports = {
  add
};
