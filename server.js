const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const flights = require('./server/routes/api/flights');

const app = express();

app.get('/', (req, res) => res.send('flight-routes'));
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { results: result ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send('Error ' + err);
  }
});

// Use routes
app.use('/api/flights', flights);

const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
