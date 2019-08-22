const express = require('express');

const flights = require('./server/routes/api/flights');

const app = express();

app.get('/', (req, res) => res.send('flight-routes'));

// Use routes
app.use('/api/flights', flights);

const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
