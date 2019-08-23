const { Airline, Airport, City, Country } = require('../../server/models');

async function addCities(results) {
  const countries = await getCountries();

  const inserts = [];

  results.forEach((result) => {
    inserts.push({
      country_id: countries[result.Country],
      name: result.City === '' ? result.Name : result.City
    });
  });

  await City.bulkCreate(inserts);
}

async function addCountries(results) {
  const existingCountries = await getCountries();
  const existing = new Set();

  for (const country in existingCountries) {
    existing.add(country);
  }

  const countriesToAdd = new Set();
  results.forEach((result) => {
    if (result.hasOwnProperty('Country') && !existing.has(result.Country)) {
      countriesToAdd.add(result.Country);
    }
  });

  const inserts = Array.from(countriesToAdd).map((country) => {
    return { name: country };
  });

  await Country.bulkCreate(inserts);
}

async function getAirlines() {
  const airlines = await Airline.findAll({
    attributes: ['id', 'name', 'two_digit_code']
  });
  const airlineObj = {};
  for (const airline of airlines) {
    airlineObj[airline.two_digit_code] = airline.id;
  }

  return airlineObj;
}

async function getAirports() {
  const airports = await Airport.findAll({
    attributes: ['id', 'name', 'three_letter_code']
  });
  const airportObj = {};
  for (const airport of airports) {
    airportObj[airport.three_letter_code] = airport.id;
  }

  return airportObj;
}

async function getCities() {
  const cities = await City.findAll({ attributes: ['id', 'name'] });
  const cityObj = {};
  for (const city of cities) {
    cityObj[city.name] = city.id;
  }

  return cityObj;
}

async function getCountries() {
  const countries = await Country.findAll({ attributes: ['id', 'name'] });
  const countryObj = {};
  for (const country of countries) {
    countryObj[country.name] = country.id;
  }

  return countryObj;
}

module.exports = {
  addCities,
  addCountries,
  getAirlines,
  getAirports,
  getCities,
  getCountries
};
