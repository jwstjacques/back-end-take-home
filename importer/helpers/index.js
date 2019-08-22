const {
  Airline,
  Airport,
  City,
  Country,
  Route
} = require('../../server/models');

async function addCountries(results) {
  const existingCountries = await getCountries();
  const existing = new Set();
  for (const country in existingCountries) {
    existing.add(country.name);
  }

  const countries = new Set();
  results.forEach((result) => {
    if (
      result.hasOwnProperty('Country') &&
      !existing.hasOwnProperty(result.country)
    ) {
      countries.add(result.Country);
    }
  });

  const inserts = Array.from(countries).map((country) => {
    return { name: country };
  });

  await Country.bulkCreate(inserts);
}

async function getCountries() {
  const countries = await Country.findAll({ attributes: ['id', 'name'] });
  const countryObj = {};
  for (const country of countries) {
    countryObj[country.name] = country.id;
  }

  return countryObj;
}

const test = async () => {
  console.log('batman');
};

module.exports = {
  addCountries,
  getCountries,
  test
};
