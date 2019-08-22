const csv = require('csv-parser');
const fs = require('fs');
const { Airline, Airport, City, Country, Route } = require('../server/models');

const airlineImporter = require('./airlines');
const airportImporter = require('./airports');
const routeImporter = require('./routes');

const files = ['airlines', 'airports', 'routes'];
const path = './data/full/';
let results = [];

async function start() {
  await Country.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await Route.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await Airline.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await Airport.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await City.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await airlineImporter.add();
  await airportImporter.add();
}

start();

// files.forEach((file) => {
//   fs.createReadStream(path + file + '.csv')
//     .pipe(csv())
//     .on('data', (data) => {
//       results.push(data);
//     })
//     .on('end', async () => {
//       switch (file) {
//         case 'airlines':
//           console.log(results.length);
//           await addCountries(results);
//           const countries = await getCountries();
//           // console.log(countries);
//           console.log('airlines');
//           break;
//         case 'airports':
//           console.log('airports');
//           break;
//         case 'routes':
//           console.log('routes');
//           break;
//       }
//       results = [];
//     });
// })
