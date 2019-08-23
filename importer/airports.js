const csv = require('csv-parser');
const fs = require('fs');
const { Airport } = require('../server/models');

const { addCities, addCountries, getCities } = require('./helpers');
const path = './data/full/airports.csv';
const results = [];

async function add() {
  let promise = new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log('----Start Adding Airports----');
        console.log('Inserting Countries');
        await addCountries(results);
        console.log('Inserting Cities');
        await addCities(results);
        console.log('Inserting Airports');
        const cities = await getCities(results);
        const inserts = results.map((row) => {
          // For airports that do not belong to a city
          const city = row.City ? row.City : row.Name;

          // CSV has spelling mistake for latitude
          return {
            city_id: cities[city],
            name: row.Name,
            latitude: row.Latitute,
            longitude: row.Longitude,
            three_letter_code: row['IATA 3']
          };
        });
        // console.log(inserts);
        console.log('Inserting Airports');
        await Airport.bulkCreate(inserts);
        console.log('End Adding Airports');
        resolve();
      });
  });

  return promise;
}

module.exports = {
  add
};
